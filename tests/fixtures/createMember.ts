import * as Discord from 'discord.js';

/**
 * Create a mockup Guild Member object for testing.
 * @param id The discord user id.
 * @param displayName The discord user name.
 * @param discriminator The discord user discriminator number.
 */
export default function createMember(id: string, displayName: string, discriminator = '4444') {
  return {
    id,
    displayName,
    user: {
      tag: `${displayName}#${discriminator}`,
    },
    send: jest.fn(),
  } as unknown as Discord.GuildMember;
}
