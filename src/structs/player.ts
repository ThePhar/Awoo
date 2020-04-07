import * as Discord from 'discord.js';

export default class Player {
  public alive = true;
  private member: Discord.GuildMember;

  constructor(member: Discord.GuildMember) {
    this.member = member;
  }

  /**
   * Returns a player name string in Discord's mention format.
   * @returns Discord mention format for this user.
   */
  toString(): string {
    return `<@${this.member.id}>`;
  }

  message(content: unknown): Promise<Discord.Message> {
    return this.member.send(content);
  }
}
