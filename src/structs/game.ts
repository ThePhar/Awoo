import * as Discord from 'discord.js';

export default class Game {
  private channel: Discord.TextChannel;

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
}
