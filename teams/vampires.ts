import { Color } from "../constants/color";
import { TeamInterface } from "../interfaces";

import dedent from "dedent";

export class Vampires implements TeamInterface {
    public readonly name = "Vampires";
    public readonly color = Color.Violet;
    public readonly data = {};
    public readonly solo = false;

    // TODO: Move to non-discord hosting.
    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863316364398559242/863316422843432970/vampires.png";

    public readonly objective = "Eliminate other supernatural threats, if any, and outnumber the villagers.";

    public readonly description = dedent`
        The **Vampires** are one of the smaller teams, but know the identity of their fellow vampires and have the ability to choose a player each night to curse. If this cursed player receives two votes to be lynched the next day, they will immediately be eliminated. They should take care not to reveal their identities or they will be quickly disposed of by the Villagers. Vampires do not have many support roles, but are immune to the Werewolves' nightly "feasting", making them one of the most powerful teams.
        
        *To win, the **Vampires** must eliminate all other supernatural teams (i.e. Werewolves, if any) then eliminate villagers until their team outnumbers them.*
    `;
}
