import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Commands from "../../enum/commands";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import Phase from "../../enum/phase";
import { adminCommandBaseSettings } from "../constants";
import { gameStart } from "../../actions/game";

export default class ForceStartCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: Commands.ForceStart,
      group: "admin",
      memberName: Commands.ForceStart,
      description: "Forces a game to begin and stop waiting for players to join."
    });
  }

  public run(message: CommandoMessage): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const store = this.manager.games.get(gameID);

    // There is no game to start!
    if (!store)
      return message.reply("there is no game running in this channel to start.");

    const game = store.getState();

    // Do not allow games that are in progress to be started again.
    if (game.phase !== Phase.Pregame)
      return message.reply("the game is already in progress!");

    // Dispatch the action, and get a new game object.
    store.dispatch(gameStart());

    return message.reply("starting Night 1.");
  }
}
