import Player from "./player";
import { RichEmbed } from "discord.js";
import EliminationCause from "./elimination-cause";

export default class Elimination {
    player: Player;
    embed: RichEmbed;
    cause: EliminationCause;

    constructor(player: Player, embed: RichEmbed, cause: EliminationCause) {
        this.player = player;
        this.embed = embed;
        this.cause = cause;
    }
}
