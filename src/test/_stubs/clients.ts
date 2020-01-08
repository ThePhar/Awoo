import { GuildMember } from "discord.js";

export function createStubGuildMember(id?: string): GuildMember {
    return ({
        id,
        user: { tag: `Test#4444` },
        toString() {
            return `<@!${id}>`;
        },
    } as unknown) as GuildMember;
}
