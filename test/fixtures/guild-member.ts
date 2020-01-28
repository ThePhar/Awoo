import * as Discord from "discord.js";

export function createMember(id: string, name: string, discriminator = "4444"): Discord.GuildMember {
    return {
        id: id,
        displayName: name,
        user: {
            tag: `${name}#${discriminator}`
        },
        send: jest.fn()
    } as unknown as Discord.GuildMember;
}
