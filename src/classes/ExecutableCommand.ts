import { ClientUser } from "discord.js";
import Settings from "../settings";

import Command from "../enums/Command";
import Player from "./Player";

class ExecutableCommand {
    readonly command: Command;
    readonly executor: ClientUser;
    readonly target?: Player;

    private constructor(command: Command, executor: ClientUser, target?: Player) {
        this.command = command;
        this.executor = executor;
        this.target = target;
    }

    static parse(string: string, executor: ClientUser): ExecutableCommand | void {
        let command;

        // Remove the command prefix from the string.
        const content = string.toLowerCase().replace(Settings.commandPrefix, "");

        // Separate the command from the rest of the message content.
        const stringArray = content.split(" ");
        const commandString = stringArray.shift();

        // Find the command in the commands list.
        for (const cmd in Command) {
            if (cmd.toLowerCase() === commandString) {
                command = cmd as Command;
                break;
            }
        }

        if (command) {
            return new ExecutableCommand(command, executor);
        }
    }
}

export default ExecutableCommand;
