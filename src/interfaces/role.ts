import { RichEmbed } from "discord.js";
import Player from "../structs/player";

export default interface Role {
    name: string;
    appearance: string;
    embed: () => RichEmbed;
    player: Player;
}
