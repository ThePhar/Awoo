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

export * from "./player-join"
export * from "./player-leave"
export * from "./elimination"
export * from "./hint"
