import * as Discord from "discord.js";
import * as ManagerFunctions from "../manager-functions";

describe("getGame", () => {
    it("should return undefined if message's channel type is not `text`.", () => {
        const testMsg = {
            channel: {
                type: "dm",
                send: jest.fn(),
            },
        } as unknown as Discord.Message;

        expect(ManagerFunctions.getGame(testMsg)).toBeUndefined();
    });
});
