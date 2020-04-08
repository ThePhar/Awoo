import * as Discord from 'discord.js';
import IRole from '../interfaces/i-role';
import Roles from '../roles';
import Game from './game';

export default class Player {
  public alive = true;
  public role: IRole;
  public game: Game;
  private member: Discord.GuildMember;

  constructor(member: Discord.GuildMember, game: Game) {
    this.member = member;
    this.game = game;
    this.role = new Roles.Villager(this);
  }

  /**
   * Returns a player name string in Discord's mention format.
   * @returns Discord mention format for this user.
   */
  toString(): string {
    return `<@${this.member.id}>`;
  }

  /**
   * Send a private message to this member via a Discord DM.
   * @param content The message to send.
   */
  message(content: unknown): Promise<Discord.Message> {
    return this.member.send(content);
  }

  /**
   * Assign a role to this player.
   * @param Role The role to assign to this player.
   */
  assignRole<T extends IRole>(Role: { new(player: Player): T }) {
    this.role = new Role(this);
  }

  get tag(): string { return this.member.user.tag; }
  get id(): string { return this.member.id; }
}
