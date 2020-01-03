import ExecutableCommand from "../../classes/ExecutableCommand";
import { Client, ClientUser } from "discord.js";
import Settings from "../../settings";
import Command from "../../enums/Command";

let client: ClientUser;
let prefix: string;
beforeAll(() => {
    prefix = Settings.commandPrefix;
    client = new ClientUser(new Client(), { id: "1234" });
});

it("should return undefined if command not in command list", () => {
    const testString = prefix + "asdf";

    const command = ExecutableCommand.parse(testString, client);
    expect(command).toBeUndefined();
});
it("should return a valid ExecutableCommand object if command exists", () => {
    const testString = prefix + Command.Join;

    const command = ExecutableCommand.parse(testString, client);
    expect(command).toBeInstanceOf(ExecutableCommand);
});
it("should return a valid ExecutableCommand object with case-insensitive command", () => {
    const uppercaseCommand = prefix + Command.Join.toUpperCase();
    const lowercaseCommand = prefix + Command.Join.toLowerCase();

    const command1 = ExecutableCommand.parse(uppercaseCommand, client);
    expect(command1).toBeInstanceOf(ExecutableCommand);

    const command2 = ExecutableCommand.parse(lowercaseCommand, client);
    expect(command2).toBeInstanceOf(ExecutableCommand);
});
