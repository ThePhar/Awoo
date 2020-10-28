import { MessageEmbed, User } from "discord.js";
import Color from "../enum/color";
import { Command as CommandoCommand } from "discord.js-commando";
import Manager from "./manager";

export class Command extends CommandoCommand {
  public get manager(): Manager {
    return this.client as Manager;
  }

  /**
   * Creates a message embed that is consistent among all informational boxes.
   * @param {string} content - The message string.
   * @param {User} author - A user to reference for additional formatting.
   */
  public createInfoBox(content: string, author?: User): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor(Color.White)
      .setDescription(content);

    if (author)
      embed.setThumbnail(author.displayAvatarURL());

    return embed;
  }
}
