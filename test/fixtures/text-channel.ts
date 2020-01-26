import * as Discord from "discord.js";

export function createTextChannel(customSendFunc?: Function): Discord.TextChannel {
    return {
        id: "500",
        name: "mock-channel",
        send: customSendFunc || jest.fn(),
        guild: {
            name: "Test Guild",
            id: "100",
        },
    } as Discord.TextChannel;
}
