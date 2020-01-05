import { RichEmbed } from "discord.js";

export default interface Role {
    name: string;
    appearance: string;
    embed: () => RichEmbed;
}
