import * as D from "discord.js"
import { getRandomHint } from "./hint"
import Game from "../struct/game"
import Color from "../enum/color"

/**
 * Default template for larger embed messages.
 * @param game
 */
export default function createTemplate(game: Game): D.MessageEmbed {
  return new D.MessageEmbed()
    .setAuthor(`${game.guild} #${game.name}`, game.iconURL)
    .setFooter(getRandomHint())
    .setColor(Color.Default)
}

export * as PlayerJoin from "./player-join"
export * as PlayerLeave from "./player-leave"
export * as Elimination from "./elimination"
export * as Hint from "./hint"
