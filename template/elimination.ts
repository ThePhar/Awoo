import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "./index"
import Color from "../enum/color"
import Game from "../struct/game"
import Player from "../struct/player"
import RoleReveal from "../enum/role-reveal"

/**
 * Print the role reveal text depending on the game setting.
 * @param player
 */
function revealRole(player: Player): string {
  switch (player.game.settings.roleReveal) {
    case RoleReveal.ExactRole:
      return `They were a **${player.role.name}**.`
    case RoleReveal.SeerAppearance:
      return `They appeared to be a **${player.role.appearance}**.`
    case RoleReveal.Team:
      return `They were affiliated with the **${player.role.team}**.`
    case RoleReveal.NoReveal:
      return "*Their true role remains a mystery.*"
  }
}


/* Generic Elimination Embeds */
/**
 * The message to announce in the channel if a player was eliminated by force. (e.g. Player left, player banned, admin
 * deleted the user, etc.)
 * @param eliminated The player being eliminated.
 */
export function forcedElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `For lore purposes, ${eliminated} has died under mysterious circumstances.`
  const description = `${eliminated} has been forcefully eliminated from the game.`

  return Template.default(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Forcefully Eliminated`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}
/**
 * The message to announce in the channel if a player was eliminated, but EliminationReveal is disabled.
 * @param eliminated The player being eliminated.
 */
export function unknownElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `You all awaken to find the corpse of ${eliminated} in the village square. Their cause of death is a mystery.`
  const description = `${eliminated} has been eliminated, but their cause is a mystery.`

  return Template.default(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Eliminated`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}


/* Lynch Elimination Embeds */
/**
 * The message to announce in the channel if a player was eliminated by lynching.
 * @param eliminated The player being eliminated.
 */
export function lynchElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = dedent(`
    The village has made their decision that ${eliminated} must be lynched for the greater good. Despite their pleas, they are forced to the gallows and after a few moments, they are hanged for their crimes.
  `)

  const description = `${eliminated} has been eliminated by the village mob.`

  return Template.default(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Lynched`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}
/**
 * The message to announce in the channel if no player was eliminated by lynching.
 * @param game The game in progress.
 */
export function noLynchElimination(game: Game): D.MessageEmbed {
  const flavorText = dedent(`
    The village was unable to come to a decision before the sunsets. With the danger of being outside during the night raising, the village comes to an agreement to go back inside for the time being and hope for the best in the night.
  `)

  return Template.default(game)
    .setColor(Color.VillagerBlue)
    .setTitle("Nobody Was Lynched")
    .setDescription(dedent(`
      > ${flavorText}
      
      Only one player can be lynched at a time. In the event of a tie, no one will be lynched.
    `))
}


/* Night Elimination Embeds */
/**
 * The message to announce in the channel if no player was eliminated last night.
 * @param game The game in progress.
 */
export function noNightElimination(game: Game): D.MessageEmbed {
  const flavorText = dedent(`
    Despite everyone's fears, there were no casualties last night. However, the village cannot rest quite yet, as the next night may not be as peaceful.
  `)

  return Template.default(game)
    .setColor(Color.VillagerBlue)
    .setTitle("Nobody Was Eliminated")
    .setDescription(dedent(`
      > ${flavorText}
      
      Due to various circumstances, no players were eliminated last night.
    `))
}
/**
 * The message to announce in the channel if a player was eliminated by a werewolf.
 * @param eliminated The player being eliminated.
 */
export function werewolfElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = dedent(`
    You all awaken to find the mangled corpse of ${eliminated} strung about the village square. It would seem they met a quite gruesome end by some wild beasts last night.
  `)

  const description = `${eliminated} has been eliminated by the **Werewolves**.`

  return Template.default(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Eaten`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}
