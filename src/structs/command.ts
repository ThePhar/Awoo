import * as Discord from 'discord.js';

export default class Command {
  readonly type: string;
  readonly args: string[];
  readonly executor: Discord.GuildMember;

  get joined() { return this.args.join(' '); }

  private constructor(type: string, args: string[], executor: Discord.GuildMember) {
    this.type = type;
    this.args = args;
    this.executor = executor;
  }

  /**
   * Take an valid message object and create a Command object out of it.
   * @param message The discord message object associated with this command.
   */
  static parse({ content, member }: Discord.Message): Command {
    // Ensure member is not null.
    if (!member) {
      throw new Error('Member not defined in parse function!');
    }

    // Make the command case-insensitive and split the array into arguments.
    const string = content.toLowerCase().trim().split(' ');

    // Remove prefix.
    string.shift();

    const type = string.shift();
    const args = string;

    // Must have a type after the prefix.
    if (!type) {
      return new Command('null', [], member);
    }

    // Create our command.
    return new Command(type, args, member);
  }
}
