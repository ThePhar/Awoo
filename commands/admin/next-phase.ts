import { Command as CommandType, GameThunkDispatch } from "../../types";
import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import { Manager } from "../../structs/manager";
import { Message } from "discord.js";
import { adminCommandBaseSettings } from "../constants";
import { nextPhase } from "../../actions/game/thunks";

export default class NextPhaseCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: CommandType.NextPhase,
      group: "admin",
      aliases: ["next"],
      memberName: CommandType.NextPhase,
      description: "Forces the next phase of the game."
    });
  }

  public run(message: CommandoMessage): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const store = this.manager.games.get(gameID);

    // There is no game to go to next phase!
    if (!store)
      return message.reply("there is no game running in this channel.");

    // Dispatch the action, and get a new game object.
    (store.dispatch as GameThunkDispatch)(nextPhase());
    const game = store.getState();

    return message.reply(`starting ${game.phase} ${game.day}.`);
  }
}
