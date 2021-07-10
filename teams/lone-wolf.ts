import { Color } from "../constants/color";
import { TeamInterface } from "../interfaces";

import dedent from "dedent";

export class LoneWolf implements TeamInterface {
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
}
