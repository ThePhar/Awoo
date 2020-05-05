import * as D from "discord.js"
import { getRandomHint } from "./hint"
import Game from "../struct/game"
import Color from "../enum/color"

/**
 * Default template for larger embed messages.
 * @param game
 */
export default function fullAnnouncementEmbed(game: Game): D.MessageEmbed {
  return new D.MessageEmbed()
    .setAuthor(`${game.guild} #${game.name}`, game.iconURL)
    .setFooter(getRandomHint())
    .setColor(Color.Default)
}

/**
 * Smaller embed for highlighting smaller data.
 * @param game
 */
export function summaryEmbed(game: Game): D.MessageEmbed {
  return new D.MessageEmbed()
    .setColor(Color.Default)
}

/**
 * Return a safe array of strings given an array for the Discord API. Also protects against empty arrays.
 * @param array
 */
export function safeArrayField<T extends object>(array: T[]): string[] {
  if (array.length === 0) {
    return ["**-**"]
  }

  return array.map((element) => element.toString())
}

export * as PlayerJoin from "./player-join"
export * as PlayerLeave from "./player-leave"
export * as Elimination from "./elimination"
export * as Hint from "./hint"
export * as Objective from "./objective"
export * as Role from "./role"
export * as Actions from "./actions"
