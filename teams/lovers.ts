import { Color } from "../constants/color";
import { TeamInterface } from "../interfaces";

import dedent from "dedent";

export class Lovers implements TeamInterface {
    public readonly name = "Forbidden Lovers";
    public readonly color = Color.Pink;
    public readonly data = {};
    public readonly solo = false;

    // TODO: Move to non-discord hosting.
    public readonly iconURL = "https://cdn.discordapp.com/attachments/863316364398559242/863316419239739432/lovers.png";

    public readonly objective = "Eliminate and outnumber everyone else.";

    public readonly description = dedent`
        The **Forbidden Lovers** are a special team that can appear if two players, chosen by the Cupid, are initially on two separate teams. They immediately learn the identity of their fellow lover and switch to their own team, but still appear to be on their initial team to everyone else. Their love is so taboo, that the only solution is for them to eliminate everyone in the village. However, if their lover is eliminated, the other will be eliminated as well, so they need to take care not to reveal themselves, especially to the Cupid, who knows who the two are, but may not know they're on their own team.
        
        *To win, the **Forbidden Lovers** must eliminate all other players before any other team reaches their win condition.*
    `;
}
