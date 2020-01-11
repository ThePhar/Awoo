import Command from "../../structs/command";

describe("parse", () => {
    it("should return a command object with the prefix removed with an empty args with simple command", () => {
        const command = Command.parse("!test") as Command;

        expect(command.type).toBe("test");
        expect(command.args[0]).toBeUndefined();
    });
    it("should return a command object with the prefix removed with specified args", () => {
        const command = Command.parse("!test name target") as Command;

        expect(command.type).toBe("test");
        expect(command.args[0]).toBe("name");
        expect(command.args[1]).toBe("target");
    });
    it("should return undefined if sending a string missing the prefix", () => {
        const command = Command.parse("test");

        expect(command).toBeUndefined();
    });
    it("should return undefined if sending an empty string", () => {
        const command = Command.parse("");

        expect(command).toBeUndefined();
    });
    it("command and args should be case insensitive", () => {
        const command = Command.parse("!TeSt nAmEs") as Command;

        expect(command.type).toBe("test");
        expect(command.args[0]).toBe("names");
    });
});
