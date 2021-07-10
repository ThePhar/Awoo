import { Color } from "../constants/color";
import { Team } from "./base";

import dedent from "dedent";

export class Cult extends Team {
    public readonly name = "Cult";
    public readonly color = Color.Green;
    public readonly data = {};
    public readonly solo = true;

    // TODO: Move to non-discord hosting.
    public readonly iconURL = "https://cdn.discordapp.com/attachments/863316364398559242/863316417038254100/cult.png";

    public readonly objective = "All remaining players must be in your cult.";

    public readonly description = dedent`
        The **Cult** is a team headed by the Cult Leader. Each night, the Cult Leader chooses another player to unknowingly join their cult. They are not notified of this happening. Ideally, the Cult Leader should not reveal themselves, as it is not advantageous for all the other teams to be cult members.
        
        *To win, the **Cult** must have all remaining players as members of the cult. The Cult Leader does not need to be alive and players in the cult will not win with the Cult Leader. This win condition takes precedence over all other win conditions.*
    `;
}
