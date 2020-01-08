import { RichEmbed } from "discord.js";
import Command from "../structs/command";

export default interface NightActive {
    nightAction: (command: Command) => void;
    nightEmbed: () => RichEmbed;
}
