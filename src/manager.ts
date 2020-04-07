import * as Discord from 'discord.js';
import * as Logging from './util/logging';

export default class Manager {
  /**
   * Initialize the manager script to watch for message events from the servers for games of Awoo.
   * @param client Discord bot client.
   */
  static async initialize(client: Discord.Client): Promise<void> {
    if (client.user === null) {
      throw new Error('Failed to get user information for Discord client.');
    }

    Logging.log(`${client.user.username} has logged into Discord successfully.`);
    await client.user.setPresence({ activity: { name: 'Ready!' }, status: 'online' });
  }
}
