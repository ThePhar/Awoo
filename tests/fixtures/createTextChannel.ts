import * as Discord from 'discord.js';

/**
 * Create a mockup Text Channel object for testing.
 */
export default function createTextChannel(): Discord.TextChannel {
  return {
    id: '1234',
    name: 'mock-channel',
    send: jest.fn(),
    guild: {
      name: 'Test Guild',
      id: '4321',
    },
  } as unknown as Discord.TextChannel;
}
