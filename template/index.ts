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
    .setAuthor(game.name)
    .setFooter(getRandomHint())
    .setColor(Color.Default)
}

export * from "./add-player"
export * from "./hint"
