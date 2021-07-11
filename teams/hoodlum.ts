import { Color } from "../constants/color";
import { Team } from "./base";

import dedent from "dedent";
import { GameInterface } from "../interfaces";
import { RoleFlags } from "../constants/role-flags";

export class Hoodlum extends Team {
    public readonly name = "Hoodlum";
    public readonly color = Color.Yellow;
    public readonly data = {};
    public readonly solo = true;

    // TODO: Move to non-discord hosting.
    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863316364398559242/863332886115385394/hoodlum.png";

    public readonly objective = "Eliminate your targets and remain alive.";

    public readonly description = dedent`
        The **Hoodlum** is a team of one that chooses a few players as a target on the first night as targets. The Hoodlum then attempts to get them eliminated, while trying to stay alive themselves. They do not have any special abilities, so they must rely on getting others to do the dirty work for them. 
        
        *To win, the **Hoodlum** must eliminate their targets and remain alive until another team reaches their win condition. This will take precedence over all other teams' win conditions except for the Cult.*
    `;

    public override reachedWinCondition(game: GameInterface): boolean {
        // Check if the team is eliminated.
        if (!this.teammates(game).every((p) => p.alive)) return false;

        // All of the Hoodlums' targets must be eliminated.
        const targets = game.players.filter(
            (p) => (p.role.flags & RoleFlags.HoodlumTarget) === RoleFlags.HoodlumTarget,
        );

        if (targets.length > 0) {
            return targets.every((p) => !p.alive);
        }

        // No targets.
        return false;
    }
}
