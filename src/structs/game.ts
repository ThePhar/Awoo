import * as Discord from 'discord.js';
import Player from './player';

export default class Game {
  private channel: Discord.TextChannel;
  private players = new Map<string, Player>();

  constructor(channel: Discord.TextChannel) {
    this.channel = channel;
  }

  /**
   * Send an announcement message to the channel designated for this game.
   * @param content The message to send.
   */
  announce(content: unknown): Promise<Discord.Message> {
    return this.channel.send(content);
  }

  /**
   * Adds and returns a player to this game instance; returns the current player if already exists.
   * @param member The Discord member object to associate with a new player.
   */
  addPlayer(member: Discord.GuildMember): Player {
    // Ensure this player doesn't already exist.
    let player = this.getPlayer(member.id);
    if (player) { return player; }

    player = new Player(member);
    this.players.set(member.id, player);

    return player;
  }

  /**
   * Removes and returns the player associated with a particular Discord Member Id; returns
   * undefined if they don't exist.
   * @param id The Discord Member id to remove.
   */
  removePlayer(id: string): Player | undefined {
    const player = this.getPlayer(id);

    // Remove this player from this game if they exist.
    if (player) {
      this.players.delete(id);
      return player;
    }

    // If player doesn't exist.
    return undefined;
  }

  /**
   * Attempt to get the player object associated with this game.
   * @param id The Discord member id for this player.
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  /**
   * Attempt to find all players that match a specified tag substring.
   * @param tag
   * @returns Object including if there's an error and a list of players found.
   */
  findPlayers(tag: string): { error: string | null, players: Player[] } {
    const playerArray: Player[] = [];
    const lTag = tag.toLowerCase();

    // Do not continue if no tag was supplied to this function.
    if (lTag === '') {
      return { error: 'No arguments', players: [] };
    }

    // Find all players in this game that match the given tag.
    this.players.forEach((player) => {
      if (player.tag.toLowerCase().includes(lTag)) {
        playerArray.push(player);
      }
    });

    return { error: null, players: playerArray };
  }
}
