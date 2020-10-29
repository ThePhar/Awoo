import { Message, TextChannel } from "discord.js";
import { Command } from "../../structs/command";
import { Command as CommandType } from "../../types";
import { CommandoMessage } from "discord.js-commando";
import { Manager } from "../../structs/manager";
import { adminCommandBaseSettings } from "../constants";

export default class ClearChannelCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: CommandType.ClearChannel,
      group: "admin",
      ownerOnly: true,
      memberName: CommandType.ClearChannel,
      description: "Deletes all messages in a particular channel. Be warned! This is irreversible!"
    });
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    const channel = message.channel as TextChannel;

    const startingMessage = await channel.send("Starting deletion... This may take some time, because Discord's API only allows so many deletions at once.");

    const messages = await channel.messages.fetch();
    for (const [, message] of messages) {
      if (startingMessage.id === message.id)
        continue;

      await message.delete();
    }

    await startingMessage.delete();
    const endMessage = await channel.send("Channel cleaned! Removing this message in 5 seconds.");

    return endMessage.delete({ timeout: 5 });
  }
}
