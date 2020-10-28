import Manager from "./structs/manager";
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
  const manager = new Manager({ commandPrefix: PREFIX, owner: PHAR_ID });
  await manager.login(process.env.DISCORD_BOT_TOKEN);
  if (manager.user)
    console.log(`Now logged into Discord as ${manager.user.username}.`);
  else
    throw new Error("No manager user object after logging into Discord.");

  // Configure Commando commands.
  manager.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerGroups([
      ["admin", "Administrative Commands"],
      ["game", "Game Commands"]
    ])
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, "cmd"));

  // Create a manager for intercepting non-commands.
  return manager;
}

void main();

console.log(path.join(__dirname, "cmd"));
