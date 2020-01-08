import { GuildMember } from "discord.js";

export function createStubGuildMember(id?: string, name?: string): GuildMember {
    let n = "Test";
    if (name) {
        n = name;
    }

    return ({
        id,
        user: { tag: `${n}#4444` },
        toString() {
            return `<@!${id}>`;
        },
    } as unknown) as GuildMember;
}
