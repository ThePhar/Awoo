import { Message } from "discord.js";

export function createTestGuildMessage(content: string): Message {
    return {
        content,
        channel: {
            type: "text",
        },
    } as Message;
}
