import { Color } from "../constants/color";
import { GameInterface } from "../interfaces";
import { RoleType } from "../constants/role-type";
import { Team } from "./base";

import dedent from "dedent";

export class Vampires extends Team {
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

    public override reachedWinCondition(game: GameInterface): boolean {
        const aliveVampires = this.teammates(game).filter((p) => p.alive && p.role.type === RoleType.Vampire).length;

        // At least one vampire must be alive.
        if (aliveVampires === 0) return false;

        // Ensure that all werewolves are eliminated.
        for (const player of game.players) {
            if (player.role.type === RoleType.Werewolf && player.alive) return false;
        }

        // Vampires must be at least double the size of living players. Also ignore tanners.
        const alive = game.players.filter((p) => p.alive && p.role.team.name !== "Tanner").length;
        return aliveVampires * 2 >= alive;
    }
}
