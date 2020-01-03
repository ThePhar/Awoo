import Settings from "../settings";

enum Command {
    Join = "Join",
    Leave = "Leave",
    Status = "Status",
    Rules = "Rules",
    Confirm = "Confirm",
    Role = "Role",
    Accuse = "Accuse",
    Lynch = "Lynch",
    Acquit = "Acquit",
    Target = "Target",
}

export default Command;
export function printCommand(command: Command, args?: Array<string>): string {
    const string = command.toLowerCase();
    let argsString = "";

    // If any arguments are specified, let's print them after the command.
    if (args) {
        for (const arg of args) {
            argsString += ` <${arg}>`;
        }
    }

    // Example: 'Target' command and 'name' arg => `!target <name>`
    return `\`${Settings.commandPrefix}${string}${argsString}\``;
}
