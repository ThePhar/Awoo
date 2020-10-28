import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Commands from "../../enum/commands";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import Phase from "../../enum/phase";
import { adminCommandBaseSettings } from "../constants";
import { nextPhase } from "../../actions/game";

export default class NextPhaseCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: Commands.NextPhase,
      group: "admin",
      memberName: Commands.NextPhase,
      description: "Forces the next phase of the game."
    });
  }

  public run(message: CommandoMessage): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const store = this.manager.games.get(gameID);

    // There is no game to go to next phase!
    if (!store)
      return message.reply("there is no game running in this channel.");

    let game = store.getState();

    // Do not allow games that are in progress to be started again.
    if (game.phase !== Phase.Day && game.phase !== Phase.Night)
      return message.reply("the game is not in progress.");

    // Dispatch the action, and get a new game object.
    store.dispatch(nextPhase());
    game = store.getState();

    return message.reply(`starting ${game.phase} ${game.day}.`);
  }
}
