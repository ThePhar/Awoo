import { Game } from "./structs/game";
import { Manager } from "./structs/manager";
import { config } from "dotenv";
import { enableMapSet } from "immer";
import path from "path";

// TODO: Remove this debug import.
import { WerewolfTargetPrompt } from "./prompts/roles/werewolf/target";
import { gameAddPlayer, nextPhase } from "./actions/game/creators";
import { GameThunkDispatch } from "./types";
import { printGameState } from "./util";

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
    .registerCommandsIn(path.join(__dirname, "commands"));

  // Start the manager's event listeners.
  manager.on("messageReactionAdd", manager.reactionHandler.bind(manager));
  manager.on("messageReactionRemove", manager.reactionHandler.bind(manager));

  // TODO: Remove this debug code.
  const store = Game.createStore("770866934912385024");
  store.subscribe(() => printGameState(store.getState()));

  store.dispatch(gameAddPlayer("196473225268428804", "Phar")); // Phar
  store.dispatch(gameAddPlayer("415060065255424002", "TestPhar")); // TestPhar
  store.dispatch(gameAddPlayer("151839470369505280", "Cainsith")); // Cainsith

  (store.dispatch as GameThunkDispatch)(nextPhase());

  await WerewolfTargetPrompt.create(manager, store, "196473225268428804");
}

void main();

console.log(path.join(__dirname, "cmd"));
