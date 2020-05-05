import * as D from "discord.js"
import Game from "../struct/game"
import Color from "../enum/color"

/**
 * The message to announce in the channel if the user was not already a player.
 * @param game The game try are attempting to leave.
 * @param member The member trying to leave.
 */
export function playerDoesNotExist(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`Hey ${member}, you are already not in this game.`)
    .setColor(Color.WerewolfRed)
}

/**
 * The message to announce in the channel if the user successfully left.
 * @param game The game they left.
 * @param member The member that left.
 */
export function successfulLeave(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`${member} has left the game in ${game.name}.`)
    .setColor(Color.VillagerBlue)
}
