import Command from "../../structs/command";
import { createTestGuildMessage } from "../fixtures/message";

const prefix = Command.prefix;

describe("getCode", () => {
    it("should return a code string for code with no args", () => {
        const message = createTestGuildMessage(`${prefix}test`);
        const command = new Command("test", message, []);

        expect(Command.getCode(command)).toBe(`\`${prefix}test\``);
    });
    it("should return a code string with args", () => {
        const message = createTestGuildMessage(`${prefix}test name target`);
        const command = new Command("test", message, ["name", "target"]);

        expect(Command.getCode(command)).toBe(`\`${prefix}test <name> <target>\``);
    });
});

describe("parse", () => {
    it("should return undefined if empty string is sent", () => {
        const command = Command.parse(createTestGuildMessage(""));

        expect(command).toBeUndefined();
    });
    it("should return a valid command object", () => {
        const message = createTestGuildMessage(`${prefix}test hello there`);
        const command = Command.parse(message);
        const test = new Command("test", message, ["hello", "there"]);

        expect(command).toMatchObject(test);
    });
    it("should be case insensitive", () => {
        const message = createTestGuildMessage(`${prefix}TeSt PlAyEr`);
        const command = Command.parse(message);
        const test = new Command("test", message, ["player"]);

        expect(command).toMatchObject(test);
    });
    it("should return a valid command object with empty args if no args supplied.", () => {
        const message = createTestGuildMessage(`${prefix}test`);
        const command = Command.parse(message);
        const test = new Command("test", message, []);

        expect(command).toMatchObject(test);
    });
    it("should trim extra whitespace from command strings", () => {
        const message = createTestGuildMessage(`  ${prefix}test   player    hello  there        `);
        const command = Command.parse(message);
        const test = new Command("test", message, ["player", "hello", "there"]);

        expect(command).toMatchObject(test);
    });
});
