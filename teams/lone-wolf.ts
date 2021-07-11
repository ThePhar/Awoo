import { Color } from "../constants/color";
import { GameInterface } from "../interfaces";
import { RoleType } from "../constants/role-type";
import { Team } from "./base";

import dedent from "dedent";

export class LoneWolf extends Team {
    public readonly name = "Lone Wolf";
    public readonly color = Color.Orange;
    public readonly data = {};
    public readonly solo = true;

    // TODO: Move to non-discord hosting.
    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863316364398559242/863316418195357696/lonewolf.png";

    public readonly objective =
        "Eliminate everyone until you reach parity with one other player or are the last one alive.";

    public readonly description = dedent`
        The **Lone Wolf** is a Werewolf that appears to be on the Werewolves' team to the Werewolves, but is actually their own team. In addition to keeping their identity a secret from the villagers, the Lone Wolf needs to fool their fellow Werewolves as well, as they will be required to get them eliminated as well. They have all the normal abilities as a Werewolf and will choose a nightly target to eliminate with them.
        
        *To win, the **Lone Wolf** must eliminate at least all but one player before anyone else reaches their win condition. If the Werewolves win, you do not win with them, so be sure to eliminate them before that happens.*
    `;

    public override reachedWinCondition(game: GameInterface): boolean {
        // Check if the team is eliminated.
        if (!this.teammates(game).every((p) => p.alive)) return false;

        // This will count Lone Wolf as well.
        const aliveWerewolves = game.players.filter((p) => p.alive && p.role.type === RoleType.Werewolf).length;

        // If more than one werewolf is alive, then we aren't done.
        if (aliveWerewolves > 1) return false;

        // Lone wolf must be the last player alive or have only one other.
        const alive = game.players.filter((p) => p.alive && p.role.team.name !== "Tanner").length;
        return 2 >= alive;
    }
}
