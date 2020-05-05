/* eslint-disable max-len */
import dedent from "dedent"
import Game from "../struct/game"

export const lynchingRules = (game: Game) => dedent(`
  During the day, you can accuse a player in ${game} to be lynched at the end of the day phase.
  
  \`/awoo lynch <name>\` to vote for a player to be eliminated.
  \`/awoo clear\` to clear a vote you made for another player.
  \`/awoo tally\` to see a list of all votes currently made.
  
  *The player with the most votes for them will be eliminated.*
  *You are not required to vote, but only one player can be eliminated at a time.* 
  *In the event of a tie vote, no player is eliminated.*
`)
