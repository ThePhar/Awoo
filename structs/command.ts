import * as D from "discord.js";

export default class Command {
    static readonly prefix = "/awoo ";
    type: string;
    args: string[];
    executor: D.GuildMember;

    private constructor(type: string, args: string[], executor: D.GuildMember) {
        this.type = type;
        this.args = args;
        this.executor = executor;
    }

    /**
     * Create a command object based off a Discord Message.
     * @param content Discord message string.
     * @param member Discord Guild Member.
     */
    static parse(content: string, member: D.GuildMember): Command {
        if (!Command.isValidCommand(content)) {
            return new Command("invalid", [], member);
        }

        // Make the command case-insensitive and split the array into arguments.
        const string = content.toLowerCase().trim().split(" ");

        // Remove prefix.
        string.shift();

        const type = string.shift();
        const args = string;

        // Must have a type after the prefix.
        if (!type) {
            return new Command("invalid", [], member);
        }

        // Create our command.
        return new Command(type, args, member);
    }
    /**
     * Check if the message content is a valid command.
     * @param content
     */
    private static isValidCommand(content: string): boolean {
        if (!content.startsWith(Command.prefix)) return false;
        return content.length > Command.prefix.length;
    }

    get joined() {
        return this.args.join(" ");
    }
}
