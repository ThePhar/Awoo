import Game from "../structs/game";
import { SkipVote } from "../types";
import chalk from "chalk";
import dedent from "dedent";
import util from "util";

export function printGameState(state: Game): void {
  let gameStatus = dedent(`
    Game State:
    ${chalk.bgBlackBright.whiteBright(" Identifier ")} ${state.id}
    ${chalk.bgBlackBright.whiteBright("    Phase   ")} ${state.phase}
    ${chalk.bgBlackBright.whiteBright("     Day    ")} ${state.day}
    
    Players:
  `);

  gameStatus += "\n";

  for (const [, player] of state.players) {
    gameStatus += dedent(`
      ${chalk.bgBlackBright.whiteBright("     ID     ")} ${player.id}
      ${chalk.bgBlackBright.whiteBright("    Role    ")} ${player.role.type}
          ${chalk.bgBlackBright.whiteBright(" Team ")} ${player.role.team}
          ${chalk.bgBlackBright.whiteBright(" Appr ")} ${player.role.appearance}
      ${chalk.bgBlackBright.whiteBright(" Meta                                ")}
      ${util.inspect(player.role.meta, false, null, true)}
    `);

    gameStatus += "\n";

    if (player.accusing === SkipVote) {
      gameStatus += dedent(`
        ${chalk.bgBlackBright.whiteBright("  Skip Vote ")}
      `);
    } else if (player.accusing) {
      gameStatus += dedent(`
        ${chalk.bgBlackBright.whiteBright("  Accusing  ")} ${player.accusing}
      `);
    } else {
      gameStatus += dedent(`
        ${chalk.bgBlackBright.whiteBright("NoAccusation")}
      `);
    }

    gameStatus += "\n\n";
  }

  console.log(gameStatus);
}
