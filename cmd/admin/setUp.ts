import AdminCommand from "../../enum/adminCommand";
import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Game from "../../structs/game";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import { adminCommandBaseSettings } from "../constants";

export default class SetUpCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: AdminCommand.SetUp,
      aliases: ["init"],
      group: "admin",
      memberName: AdminCommand.SetUp,
      description: "Sets up and initializes a game in the channel this command is invoked in. Moderator will then take over managing messages, events, and commands in that channel."
    });
  }

  public run(message: CommandoMessage): Promise<Message | Message[]> {
    // TODO: Create new game embed message.

    const id = message.channel.id;
    const game = this.manager.games.get(id);

    // A game is already initialized for this channel.
    if (game)
      return message.reply("there is already a game in this channel.");

    this.manager.games.set(id, new Game({ id }));
    return message.reply("a game has been created in this channel.");
  }
}
