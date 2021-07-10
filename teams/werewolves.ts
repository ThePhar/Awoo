import { Color } from "../constants/color";
import { TeamInterface } from "../interfaces";

import dedent from "dedent";

export class Werewolves implements TeamInterface {
    public readonly name = "Werewolves";
    public readonly color = Color.Red;
    public readonly data = {};
    public readonly solo = false;

    // TODO: Move to non-discord hosting.
    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863316364398559242/863316425660694528/werewolves.png";

    public readonly objective = "Eliminate other supernatural threats, if any, and outnumber the villagers.";

    public readonly description = dedent`
        The **Werewolves** are one of the smaller teams, but know the identity of their fellow werewolves and have the the ability to eliminate a player each night. They must take care not to reveal their identities or they will be quickly disposed of by the Villagers. In large enough numbers, they will also have additional roles that can help support them find and eliminate larger threats.
        
        *To win, the **Werewolves** must eliminate all other supernatural teams (i.e. Vampires, if any) then eliminate villagers until their team outnumbers them.*
    `;
}
