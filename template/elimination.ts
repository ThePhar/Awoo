import dedent from "dedent"
import * as D from "discord.js"
import Color from "../enum/color"
import Player from "../struct/player"
import createTemplate from "./index"
import RoleReveal from "../enum/role-reveal"
import Game from "../struct/game"

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

/**
 * The message to announce in the channel if a player was eliminated by force. (e.g. Player left, player banned, admin
 * deleted the user, etc.)
 * @param eliminated The player being eliminated.
 */
export function forcedElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `For lore purposes, ${eliminated} has died under mysterious circumstances.`
  const description = `${eliminated} has been forcefully eliminated from the game.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Forcefully Eliminated`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by a werewolf.
 * @param eliminated The player being eliminated.
 */
export function werewolfElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `You all awaken to find the mangled corpse of ${eliminated} strung about the village square. It `
    + "would seem they met a quite gruesome end by some wild beasts last night."
  const description = `${eliminated} has been eliminated by the **Werewolves**.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Eaten`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by a hunter.
 * @param eliminated The player being eliminated.
 * @param hunter The hunter that killed this player.
 */
export function hunterElimination(eliminated: Player, hunter: Player): D.MessageEmbed {
  const flavorText = `With their end coming close, ${hunter} quickly draws their trusty gun and takes one final shot `
    + `at ${eliminated}. Both of them do not survive.`
  const description = `${eliminated} has been eliminated by **Hunter** ${hunter}.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Shot`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by a witch.
 * @param eliminated The player being eliminated.
 */
export function witchElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `You all fail to see ${eliminated} during the morning meeting of all the villagers. You all `
    + "arrive at their house to find them dead. The village doctor rules it to be caused by a poisoned apple they had "
    + "last night; most likely poisoned by a witch."
  const description = `${eliminated} has been eliminated by a **Witch**.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Poisoned`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by a cupid.
 * @param eliminated The player being eliminated.
 * @param lover The player that was eliminated originally.
 */
export function cupidElimination(eliminated: Player, lover: Player): D.MessageEmbed {
  const flavorText = `The moment ${eliminated} sees the dead body of their lover, ${lover}, they are engulfed in a `
    + "torrent of various emotions. Shortly thereafter, they suddenly collapse and fade away as well. The village "
    + "doctor rules their death from cardiac arrest brought on by the intense depression of losing their lover."
  const description = `${eliminated} has been eliminated by the effects of **Cupid**.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Heartbroken`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if players were eliminated by a bomber.
 * @param bomber The bomber player that was eliminated.
 * @param victims A list of players that were killed by the bomber's effect.
 */
export function bomberEliminations(bomber: Player, victims: Player[]): D.MessageEmbed {
  const victimPlural = victims.length === 1 ? "victim" : "victims"

  const flavorText = `With their end coming in, ${bomber} activates their concealed explosives to take out anyone `
    + `nearby. The uncontrolled blast wave ends up killing ${victims.length} ${victimPlural}, possibly to the `
    + "determent to their own team."

  const description = victims
    .map((victim) => `${victim} has been eliminated by the **Mad Bomber**. ${revealRole(victim)}`)
    .join("\n")

  return createTemplate(bomber.game)
    .setColor(Color.WerewolfRed)
    .setTitle("The Mad Bomber Exploded")
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by a huntress.
 * @param eliminated The player being eliminated.
 */
export function huntressElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = "Last night, one of the villagers decided to take matters into their own hands and prepared to "
    + "finish this once and for all. When the opportunity presented itself, they cocked an arrow into their bow and "
    + `fired it straight and true into the back ${eliminated}, striking them through their heart. You all find their `
    + "body in the morning just outside their residence."
  const description = `${eliminated} has been eliminated by a **Huntress**.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Struck Through`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by not fulfilling the teenage werewolf condition.
 * @param eliminated The player being eliminated.
 */
export function teenageWerewolfEffectElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `Being a younger werewolf, ${eliminated}'s lycanthropy was volatile and placed a large burden on `
    + "them, requiring that they say a particular phrase at least once per day to prevent their curse from killing "
    + "them before they could mature. Unfortunately, they failed to say it yesterday and died in the night. Oops."
  const description = `${eliminated} has been eliminated by failing to say "wolf" yesterday.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Too Immature`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by the tough guy effect.
 * @param eliminated The player being eliminated.
 */
export function toughGuyElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `The night before last, the werewolves paid a visit to ${eliminated} and nearly killed them, but `
    + "they were badly injured in the struggle. They attempted to stay strong however, and forced themselves to stay "
    + "alive long enough to help the village one more time the next day. Regardless of whether they managed to do "
    + "that, the moment the sun rose the day after, they succumbed to their wounds and died."
  const description = `${eliminated} has been eliminated by the **Werewolves**, but managed to survive an additional `
    + "day because of their toughness."

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Succumbed To Their Wounds`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by a vampire's effect.
 * @param eliminated The player being eliminated.
 */
export function vampireElimination(eliminated: Player): D.MessageEmbed {
  const flavorText = `During the arguments being thrown about in the day, multiple players accused ${eliminated} of `
    + "treason against the town. Before they could give a more solid defense, they suddenly collapsed. A village "
    + "doctor pronounced them dead and found 2 marks on their neck. It would seem a vampire had placed a spell on them "
    + "after feeding on them and it activated the moment they were in the hot-seat."
  const description = `${eliminated} has been eliminated by the **Vampires'** effect.`

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Collapsed During Accusation`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
}

/**
 * The message to announce in the channel if a player was eliminated by lynching.
 * @param eliminated The player being eliminated.
 * @param votes The votes made against a particular player.
 */
export function lynchElimination(eliminated: Player, votes: { player: Player; count: number }[]): D.MessageEmbed {
  const flavorText = `The village has made their decision that ${eliminated} must be lynched for the greater good. `
    + "Despite their pleas, they are forced to the gallows and after a few moments, they are hanged for their crimes."
  const description = `${eliminated} has been eliminated by the village mob.`
  const voteTable = votes.map(({ player, count }) => `\`${count}\` ${player}`)

  return createTemplate(eliminated.game)
    .setColor(Color.WerewolfRed)
    .setTitle(`${eliminated.name} Was Lynched`)
    .setDescription(dedent(`
      > ${flavorText}
      
      ${description} ${revealRole(eliminated)}
    `))
    .addField("Tallied Lynch Votes", voteTable)
}

/**
 * The message to announce in the channel if no player was eliminated by lynching.
 * @param game The game in progress.
 * @param votes The votes made against a particular player.
 */
export function noLynchElimination(game: Game, votes: { player: Player; count: number }[]): D.MessageEmbed {
  const flavorText = "The village was unable to come to a decision before the sunsets. With the danger of being "
    + "outside during the night raising, the village comes to an agreement to go back inside for the time being and "
    + "hope for the best in the night."
  const voteTable = votes.map(({ player, count }) => `\`${count}\` ${player}`)

  const embed = createTemplate(game)
    .setColor(Color.VillagerBlue)
    .setTitle("Nobody Was Lynched")
    .setDescription(dedent(`
      > ${flavorText}
      
      Only one player can be lynched at a time. In the event of a tie, no one will be lynched.
    `))

  if (voteTable.length > 0) {
    embed.addField("Tallied Lynch Votes", voteTable)
  }

  return embed
}

/**
 * The message to announce in the channel if no player was eliminated last night.
 * @param game The game in progress.
 */
export function noNightElimination(game: Game): D.MessageEmbed {
  const flavorText = "Despite everyone's fears, there were no casualties last night. However, the village cannot rest "
    + "quite yet, as the next night may not be as peaceful."

  return createTemplate(game)
    .setColor(Color.VillagerBlue)
    .setTitle("Nobody Was Eliminated")
    .setDescription(dedent(`
      > ${flavorText}
      
      Due to various circumstances, no players were eliminated last night.
    `))
}
