import * as D from "discord.js"
import Game from "../struct/game"
import createTemplate from "./index"
import Color from "../enum/color"

/**
 * The message to send the user to check if they are accepting Direct Messages.
 * @param game The game try are attempting to join.
 * @param member The member trying to join.
 */
export function playerAddDMCheck(game: Game, member: D.GuildMember): D.MessageEmbed {
  return createTemplate(game)
    .setDescription(`Hey ${member}, just shooting you a DM to let you know you joined the game in ${game.channel}!`)
}

/**
 * The message to announce in the channel if the user was already a member of the upcoming game.
 * @param game The game try are attempting to join.
 * @param member The member trying to join.
 */
export function playerAlreadyExists(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`${member}, you are already signed up for the next game.`)
    .setColor(Color.WerewolfRed)
}

/**
 * The message to announce in the channel if the user was attempting to join a game already in progress.
 * @param game The game try are attempting to join.
 * @param member The member trying to join.
 */
export function gameInProgress(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`${member}, you cannot join a game in progress.`)
    .setColor(Color.WerewolfRed)
}

/**
 * The message The message to announce in the channel if the maximum number of players allowed in a single game has
 * been reached.
 * @param game The game try are attempting to join.
 * @param member The member trying to join.
 */
export function maxPlayersReached(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`${member}, we have reached the maximum allowed players (${game.settings.maxPlayers}).`)
    .setColor(Color.WerewolfRed)
}

/**
 * The message to announce in the channel if the user is not allowing Direct Messages while attempting to join.
 * @param game The game try are attempting to join.
 * @param member The member trying to join.
 */
export function unableToDMPlayer(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`${member}, you must allow Direct Messages from users of this server to join.`)
    .setColor(Color.WerewolfRed)
}

/**
 * The message to announce in the channel if the user successfully joined.
 * @param game The game they joined.
 * @param member The member that joined.
 */
export function success(game: Game, member: D.GuildMember): D.MessageEmbed {
  return new D.MessageEmbed()
    .setDescription(`${member}, you have joined the next game in ${game.channel}.`)
    .setColor(Color.VillagerBlue)
}
