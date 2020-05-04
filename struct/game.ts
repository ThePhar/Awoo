import * as D from "discord.js"
import Player from "./player"
import Phase from "../enum/phase"
import GameState from "./game-state"
import Settings from "./settings"

import * as AddPlayerTemplate from "../template/add-player"

export default class Game {
  public gameStates: GameState[] = []
  public settings: Settings = new Settings()
  public channel: D.TextChannel

  public get state(): GameState { return this.gameStates[this.gameStates.length - 1] }
  public get name(): string { return this.channel.name }

  public constructor(channel: D.TextChannel) {
    this.channel = channel
  }

  /**
   * Send a message to the channel that this game object is assigned in.
   * @param content The message to send.
   */
  public async announce(content: string | D.MessageEmbed): Promise<D.Message> {
    return this.channel.send(content)
  }

  /**
   * Check if a player is able to join a game and add them to the next upcoming game if allowed.
   * @param member The member attempting to join.
   */
  public async playerJoin(member: D.GuildMember): Promise<void> {
    const { players, phase, playerCount } = this.state

    // Do not add a player if the player already existed in this game.
    if (players.has(member.id)) {
      await this.announce(AddPlayerTemplate.playerAlreadyExists(this, member))
      return
    }

    // Do not add a player if a game is in progress.
    if (phase !== Phase.WaitingForPlayers) {
      await this.announce(AddPlayerTemplate.gameInProgress(this, member))
      return
    }

    // Do not add a player if we reached the max cap on players.
    if (playerCount >= this.settings.maxPlayers) {
      await this.announce(AddPlayerTemplate.maxPlayersReached(this, member))
      return
    }

    // Do not add a player if they do not accept DMs.
    try {
      await member.send(AddPlayerTemplate.playerAddDMCheck(this, member))
    } catch {
      await this.announce(AddPlayerTemplate.unableToDMPlayer(this, member))
      return
    }

    await this.announce(AddPlayerTemplate.success(this, member))

    // Create our player and add it to our game.
    const newPlayers = new Map<string, Player>()
    const player = new Player(member)
    players.forEach((player, id) => newPlayers.set(id, player))
    newPlayers.set(member.id, player)
    this.gameStates.push(...this.gameStates, new GameState({ players: newPlayers }, this.state))
  }
}
