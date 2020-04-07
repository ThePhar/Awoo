import * as Discord from 'discord.js';
import * as Env from 'dotenv';
import * as Logging from './util/logging';

import Manager from './manager';

const result = Env.config();
if (result.error) {
  throw result.error;
}

const client = new Discord.Client();
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => Manager.initialize(client))
  .then(() => Logging.log('Manager is online and ready to begin.'))
  .catch((err) => Logging.error(`Error connecting to Discord: ${err}`));
