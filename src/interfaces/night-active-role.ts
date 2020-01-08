import { RichEmbed } from "discord.js";
import Command from "../structs/command";
import Player from "../structs/player";

export default interface NightActiveRole {
    name: string;
    appearance: string;
    embed: () => RichEmbed;
    player: Player;

    nightAction: (command: Command) => void;
    nightEmbed: () => RichEmbed;
}
