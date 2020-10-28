import Color from "../enum/color";
import { Command as CommandoCommand } from "discord.js-commando";
import Manager from "./manager";
import { MessageEmbed } from "discord.js";

export class Command extends CommandoCommand {
  public get manager(): Manager {
    return this.client as Manager;
  }

  /**
   * Creates a message embed that is consistent among all informational boxes.
   * @param {string} content - The message string.
   * @param {string} pictureURL - A url to the picture to show in the thumbnail.
   */
  public createInfoBox(content: string, pictureURL?: string | null): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor(Color.White)
      .setDescription(content);

    if (pictureURL)
      embed.setThumbnail(pictureURL);

    return embed;
  }
}
