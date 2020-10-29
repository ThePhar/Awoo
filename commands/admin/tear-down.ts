import { Command } from "../../structs/command";
import { Command as CommandType } from "../../types/command";
import { CommandoMessage } from "discord.js-commando";
import { Manager } from "../../structs/manager";
import { Message } from "discord.js";
import { adminCommandBaseSettings } from "../constants";

export default class TearDownCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: CommandType.TearDown,
      group: "admin",
      memberName: CommandType.TearDown,
      description: "Stops any games in the current channel and stops managing events in the channel."
    });
  }

  public run(message: CommandoMessage): Promise<Message | Message[]> {
    // TODO: Write nicer looking message.
    const id = message.channel.id;

    // There is no game to delete!
    if (!this.manager.games.has(id))
      return message.reply("there is no game running in this channel to tear down.");

    this.manager.games.delete(id);
    return message.reply("I have deleted the game in this channel.");
  }
}
