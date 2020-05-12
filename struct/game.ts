import * as D from "discord.js"
import * as Roles from "../role"
import Player from "./player"
import Phase from "../enum/phase"
import GameState from "./game-state"
import Settings from "./settings"
import Elimination from "../enum/elimination"

import * as Template from "../template"

export type PlayerMap = Map<string, Player>
export type Vote = { count: number; target: Player }
export type PlayerArray = { alive: Player[]; eliminated: Player[]; all: Player[] }

export default class Game {
  public gameStates: GameState[] = []
  public settings: Settings = new Settings()
  private channel: D.TextChannel
  private players: PlayerMap = new Map<string, Player>();

  public constructor(channel: D.TextChannel) {
    this.channel = channel
  }

  public toString = (): string => this.channel.toString()

  /**
   * Send a message to the channel that this game object is assigned in.
   * @param content The message to send.
   */
  public async announce(content: string | D.MessageEmbed): Promise<D.Message> {
    return this.channel.send(content)
  }

  /**
   * Find all players that match a particular substring or id
   * @param identifier A substring of a display name, tag, or discord mention.
   */
  public findPlayers(identifier: string): Player[] {
    const players: Player[] = []

    // Do not attempt to search with an empty string.
    if (identifier.trim() === "")
      return []

    // Determine if we were supplied a discord mention identifier or a name.
    const discordMentionFormat = /^<@!?([0-9]+)>$/
    if (discordMentionFormat.test(identifier)) {
      const match = discordMentionFormat.exec(identifier) as RegExpExecArray
      const player = this.players.get(match[1])

      return player ? [player] : []
    }

    // Make our substring case-insensitive.
    const substring = identifier.toLowerCase()

    this.players.forEach((player) => {
      // More case-insensitive setup.
      const tag = player.tag.toLowerCase()
      const displayName = player.name.toLowerCase()

      // Find all players that include the substring in their display name or tag.
      if (tag.includes(substring) || displayName.includes(substring))
        players.push(player)
    })

    return players
  }

  /**
   * Find a player associated with a member object.
   * @param member
   */
  public getPlayer(member: D.GuildMember): Player | undefined {
    return this.players.get(member.id)
  }

  /**
   * Check if a player is able to join a game and add them to the next upcoming game if allowed.
   * @param member The member attempting to join.
   */
  public async playerJoin(member: D.GuildMember): Promise<void> {
    const { phase } = this.state

    // Do not add a player if the player already existed in this game.
    if (this.players.has(member.id)) {
      await this.announce(Template.PlayerJoin.playerAlreadyExists(this, member))
      return
    }

    // Do not add a player if a game is in progress.
    if (phase !== Phase.WaitingForPlayers) {
      await this.announce(Template.PlayerJoin.gameInProgress(this, member))
      return
    }

    // Do not add a player if we reached the max cap on players.
    if (this.playerCount >= this.settings.maxPlayers) {
      await this.announce(Template.PlayerJoin.maxPlayersReached(this, member))
      return
    }

    // Do not add a player if they do not accept DMs.
    try {
      await member.send(Template.PlayerJoin.playerAddDMCheck(this, member))
    } catch {
      await this.announce(Template.PlayerJoin.unableToDMPlayer(this, member))
      return
    }

    // Add our player to the game.
    await this.announce(Template.PlayerJoin.successfulJoin(this, member))
    this.addPlayer(member)
  }

  /**
   * Remove a player from the game. If they are in an on-going game, forcefully eliminate them.
   * @param member
   */
  public async playerLeave(member: D.GuildMember): Promise<void> {
    const player = this.players.get(member.id)

    // If we couldn't find a player, it means they were not in the game to begin with.
    if (!player) {
      await this.announce(Template.PlayerLeave.playerDoesNotExist(this, member))
      return
    }

    // Kill this player if they were already alive.
    if (player.alive) {
      await player.eliminate(Elimination.ForcedExit)

      // TODO: Check for win condition.
    }

    // Remove this player.
    await this.announce(Template.PlayerLeave.successfulLeave(this, member))
    this.players.delete(member.id)
  }

  /**
   * Forcefully add/reset a player to the game.
   * @param member The discord member object.
   */
  private addPlayer(member: D.GuildMember): void {
    if (this.players.has(member.id)) {
      this.players.set(member.id, new Player(member, this))
    }
  }

  /**
   * Forcefully delete a player from the game.
   * @param member The discord member object.
   */
  private removePlayer(member: D.GuildMember): void {
    this.players.delete(member.id)
  }

  /**
   * Get a sorted list of all votes currently made by players sorted by most to least votes.
   */
  private getLynchVotes(): Vote[] {
    // Keep track of our votes.
    const votes = new Map<string, Vote>()

    // Count each vote and increment our counter.
    this.playerStates.alive.forEach((player) => {
      if (player.accusation) {
        // Mayors' votes count twice.
        const increment = player.role instanceof Roles.Mayor ? 2 : 1
        const vote = votes.get(player.accusation.id) || { count: 0, target: player.accusation }

        vote.count += increment
        votes.set(player.accusation.id, vote)
      }
    })

    // Convert to an array and sort by vote count.
    return [...votes.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([, element]) => element)
  }

  /**
   * Get a sorted list of all targets made by wolves.
   */
  private getWolfVotes(): Vote[] {
    // Keep track of our votes.
    const votes = new Map<string, Vote>()

    // Count each vote and increment our counter.
    this.playerStates.alive
      .filter((player) => player.role.isWerewolf)
      .forEach((werewolf) => {
      if (werewolf.role.target) {
        // Mayors' votes count twice.
        const increment = werewolf.role instanceof Roles.Mayor ? 2 : 1
        const vote = votes.get(werewolf.accusation.id) || { count: 0, target: werewolf.accusation }

        vote.count += increment
        votes.set(werewolf.accusation.id, vote)
      }
    })

    // Convert to an array and sort by vote count.
    return [...votes.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([, element]) => element)
  }

  public get name(): string { return this.channel.name }
  public get playerCount(): number { return this.players.size }
  public get playerStates(): PlayerArray {
    const all: Player[] = []
    const alive: Player[] = []
    const eliminated: Player[] = []

    this.players.forEach((player) => {
      all.push(player)

      if (player.alive)
        alive.push(player)
      else
        eliminated.push(player)
    })

    return { all, alive, eliminated }
  }
  public get state(): GameState { return this.gameStates[this.gameStates.length - 1] }
  public get iconURL(): string { return this.channel.guild.iconURL() || "" }
  public get guild(): string { return this.channel.guild.name }
}
