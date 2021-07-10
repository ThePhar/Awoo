import { Color } from "../constants/color";
import { TeamInterface } from "../interfaces";

import dedent from "dedent";

export class Villagers implements TeamInterface {
    public readonly name = "Villagers";
    public readonly color = Color.Blue;
    public readonly data = {};
    public readonly solo = false;

    // TODO: Move to non-discord hosting.
    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863316364398559242/863316423753203742/villagers.png";

    public readonly objective = "Find and eliminate all supernatural threats.";

    public readonly description = dedent`
        The **Villagers** are the largest team, with many helpful support roles, but *usually* the weakest ability to eliminate threats. Ideally, their best route is to figure out who can be trusted as soon as possible and lynch any potential threats before they lose their size advantage.
        
        *To win, the **Villagers** must eliminate all supernatural teams (i.e. Werewolves and Vampires) before any other team reaches their win conditions.* 
    `;
}
