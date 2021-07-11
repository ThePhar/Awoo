import { Color } from "../constants/color";
import { Team } from "./base";

import dedent from "dedent";

export class Spectators extends Team {
    public readonly name = "Spectators";
    public readonly color = Color.White;
    public readonly data = {};
    public readonly solo = false;

    // TODO: Move to non-discord hosting.
    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863316364398559242/863555225737756692/spectator.png";

    public readonly objective = "Wait to play the next game.";

    public readonly description = dedent`
        The **Spectators** are a team that consists of non-players. This is the team everyone joins initially, before their roles are assigned. This is a secret team.
    `;

    public override reachedWinCondition(): boolean {
        // Spectators never win. Sorry.
        return false;
    }
}
