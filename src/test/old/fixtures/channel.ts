import { Client, Guild, TextChannel } from "discord.js";

export function createTestTextChannel(data = {}): TextChannel {
    return new TextChannel(new Guild(new Client(), { emojis: [] }), data);
}
