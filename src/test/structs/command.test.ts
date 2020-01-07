import Command from "../../structs/command";
import { createTestClient } from "../fixtures/player";

const client = createTestClient();

describe("getCode", () => {
    it("should return a code string for code with no args", () => {
        const command = new Command("test", client, []);

        expect(Command.getCode(command)).toBe("`!test`");
    });
    it("should return a code string with args", () => {
        const command = new Command("test", client, ["name", "target"]);

        expect(Command.getCode(command)).toBe("`!test <name> <target>`");
    });
});

describe("parse", () => {
    it("should return undefined if empty string is sent", () => {
        const command = Command.parse("", client);

        expect(command).toBeUndefined();
    });
    it("should return a valid command object", () => {
        const command = Command.parse("!test hello there", client);
        const test = new Command("test", client, ["hello", "there"]);

        expect(command).toMatchObject(test);
    });
    it("should be case insensitive", () => {
        const command = Command.parse("!TeSt PlAyEr", client);
        const test = new Command("test", client, ["player"]);

        expect(command).toMatchObject(test);
    });
    it("should return a valid command object with empty args if no args supplied.", () => {
        const command = Command.parse("!test", client);
        const test = new Command("test", client, []);

        expect(command).toMatchObject(test);
    });
    it("should trim extra whitespace from command strings", () => {
        const command = Command.parse("  !test   player    hello  there        ", client);
        const test = new Command("test", client, ["player", "hello", "there"]);

        expect(command).toMatchObject(test);
    });
});
