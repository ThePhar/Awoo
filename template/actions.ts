import dedent from "dedent"
import Game from "../struct/game"

export const lynchingRules = (game: Game): string => dedent(`
  During the day, you can accuse a player in ${game} to be lynched at the end of the day phase.
  
  \`/awoo lynch <name>\` to vote for a player to be eliminated.
  \`/awoo clear\` to clear a vote you made for another player.
  \`/awoo tally\` to see a list of all votes currently made.
  
  *❖ The player with the most votes for them will be eliminated.*
  *❖ You are not required to vote, but only one player can be eliminated at a time.* 
  *❖ In the event of a tie vote, no player is eliminated.*
`)

export const seerRules = (): string => dedent(`
  During the night, you will receive a Direct Message to choose a player you can inspect. When the night phase ends, if you were not eliminated, you will receive a notification if they appear to be a villager or a werewolf.
  
  *❖ Some roles, like Lycan and Wolfman, can appear opposite of their team. Take care to know which roles are in play.*
  *❖ You will not receive a notification with your target's appearance if you were eliminated in the night.*
  *❖ If you do not confirm a player, you will forfeit your action.*
`)

export const werewolfRules = (): string => dedent(`
  During the night, you and your werewolf team will receive a Direct Message to choose a player to be eliminated at the end of the night phase. You will be notified if and when your fellow werewolves make or change their target in the night.
  
  *❖ You cannot choose players to eliminate on the first night.*
  *❖ The player with the most werewolves targeting them will be eliminated.*
  *❖ If you do not confirm a target, you will forfeit your action when the phase ends.* 
  *❖ In the event of a tie, no player is eliminated.*
`)
