import { Color } from "../constants/color";
import { TeamInterface } from "../interfaces";

import dedent from "dedent";

export class Tanner implements TeamInterface {
    public readonly name = "Tanner";
    public readonly color = Color.Brown;
    public readonly data = {};
    public readonly solo = true;

    // TODO: Move to non-discord hosting.
    public readonly iconURL = "https://cdn.discordapp.com/attachments/863316364398559242/863316420930043914/tanner.png";

    public readonly objective = "Be eliminated.";

    public readonly description = dedent`
        The **Tanner** is a team of one player, the Tanner, who hates their job and hates their life. They only have one mission, get eliminated.
        
        *To win, the **Tanner** must be eliminated. They are not counted when determining how many eliminated players are required for other teams' win conditions.*
    `;
}
