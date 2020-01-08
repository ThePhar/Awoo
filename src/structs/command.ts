import { User, Message } from "discord.js";

export default class Command {
    readonly type: string;
    readonly executor: User;
    readonly message: Message;
    readonly args: Array<string>;
    readonly isDM: boolean;

    // TODO: Get prefix from settings file?
    static readonly prefix = "!";

    constructor(command: string, message: Message, args: Array<string>) {
        this.type = command;
        this.executor = message.author;
        this.message = message;
        this.args = args;
        this.isDM = message.channel.type === "dm";
    }

    static parse(message: Message): Command | undefined {
        // Remove the command prefix from the string.
        let content = message.content.toLowerCase().replace(Command.prefix, "");
        // Remove extra whitespace as well.
        content = content.replace(/\s+/g, " ").trim();

        // Separate the command from the rest of the message content.
        const args = content.split(" ");
        const command = args.shift(); // First value is a command, not an argument.

        if (command) {
            return new Command(command, message, args);
        }
    }

    static getCode(command: string, args: Array<string>): string {
        // Take a command like: { type: 'test', args: ['hello', 'there'], ... }
        // and return a string like: `!test <hello> <there>`
        let s = `\`${Command.prefix}${command}`;
        if (args) {
            for (const arg of args) {
                s += ` <${arg}>`;
            }
        }
        s += `\``;

        return s;
    }
}
