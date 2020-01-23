import Player             from "./player";
import Game               from "./game";
import RecognisedCommands from "./recognised-commands";

export default class Command {
    readonly type: string | RecognisedCommands;
    readonly target?: Player | Player[];
    readonly args: string;

    static readonly prefix = "!";

    constructor(command: string, args: string, target?: Player | Player[]) {
        this.type = command;
        this.args = args;
        this.target = target;
    }

    static parse(string: string, game: Game): Command | undefined {
        // Check for the prefix.
        if (string.startsWith(Command.prefix)) {
            const splitString = string.toLowerCase().trim().split(" ");
            let command = splitString.shift() as string;

            string = splitString.join(" ");
            command = command.replace(Command.prefix, "");

            // Regex for checking for player strings.
            const regex = /<@!?([0-9]+)>/;

            if (regex.test(string)) {
                string = (regex.exec(string) as RegExpExecArray)[1];

                return new Command(command, string, game.getPlayer(string));
            } else {
                return new Command(command, string, game.getPlayerByTag(string));
            }
        }

        return undefined;
    }
}
