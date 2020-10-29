import { Command } from "../../structs/command";
import { Command as CommandType } from "../../types/command";
import { CommandoMessage } from "discord.js-commando";
import { Game } from "../../structs/game";
import { Manager } from "../../structs/manager";
import { Message } from "discord.js";
import { adminCommandBaseSettings } from "../constants";
import { printGameState } from "../../util";

export default class SetUpCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: CommandType.SetUp,
      aliases: ["init"],
      group: "admin",
      memberName: CommandType.SetUp,
      description: "Sets up and initializes a game in the channel this command is invoked in. Moderator will then take over managing messages, events, and commands in that channel."
    });
  }

  public run(message: CommandoMessage): Promise<Message | Message[]> {
    const id = message.channel.id;

    // A game is already initialized for this channel.
    if (this.manager.games.has(id))
      return message.reply("there is already a game in this channel.");

    // Create our game and add it to the manager for managing.
    const store = Game.createStore(id);
    this.manager.games.set(id, store);

    // TODO: Remove this debug.
    store.subscribe(() => {
      console.clear();
      printGameState(store.getState());
    });

    return message.reply("a game has been created in this channel.");
  }
}
