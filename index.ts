import Commando from "discord.js-commando";
import Manager from "./struct/manager";
import { config } from "dotenv";
import { enableMapSet } from "immer";
import path from "path";

const PREFIX = "/awoo";
const PHAR_ID = "196473225268428804";

async function main() {
  // Set up all environment variables in .env files.
  const result = config();
  if (result.error) {
    throw result.error;
  }

  // Immer will be required to work with maps, so we need to enable that setting.
  enableMapSet();

  // Log into Discord.
  const client = new Commando.CommandoClient({ commandPrefix: PREFIX, owner: PHAR_ID });
  await client.login(process.env.DISCORD_BOT_TOKEN);

  // Configure Commando commands.
  client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, "cmd"));

  // Create a manager for intercepting non-commands.
  new Manager(client);
}

void main();
