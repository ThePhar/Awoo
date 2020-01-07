import { ClientUser } from "discord.js";

export default class Command {
    readonly type: string;
    readonly executor: ClientUser;
    readonly args: Array<string>;

    // TODO: Get prefix from settings file.
    static readonly prefix = "!";

    constructor(command: string, executor: ClientUser, args: Array<string>) {
        this.type = command;
        this.executor = executor;
        this.args = args;
    }

    static parse(string: string, executor: ClientUser): Command | undefined {
        // Remove the command prefix from the string.
        let content = string.toLowerCase().replace(Command.prefix, "");
        // Remove extra whitespace as well.
        content = content.replace(/\s+/g, " ").trim();

        // Separate the command from the rest of the message content.
        const args = content.split(" ");
        const command = args.shift(); // First value is a command, not an argument.

        if (command) {
            return new Command(command, executor, args);
        }
    }

    static getCode(command: Command): string {
        // Take a command like: { type: 'test', args: ['hello', 'there'], ... }
        // and return a string like: `!test <hello> <there>`
        let s = `\`${Command.prefix}${command.type}`;
        for (const arg of command.args) {
            s += ` <${arg}>`;
        }
        s += `\``;

        return s;
    }
}
