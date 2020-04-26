import * as Discord from 'discord.js';
import * as Env from 'dotenv';
import Manager from './struct/manager';

const result = Env.config();
if (result.error) {
  throw result.error;
}

const client = new Discord.Client();

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => new Manager(client));
