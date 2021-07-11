import { Role } from "./base";
import { RoleType } from "../constants/role-type";
import { RoleFlags } from "../constants/role-flags";
import { Spectators } from "../teams/spectators";

import dedent from "dedent";

export class Spectator extends Role {
    protected readonly names: [singular: string, plural: string] = ["Spectator", "Spectators"];

    public readonly type = RoleType.Villager;
    public readonly data = {};
    public readonly flags = RoleFlags.Hidden;
    public readonly weight = 0;
    public readonly team = new Spectators();

    public readonly iconURL =
        "https://cdn.discordapp.com/attachments/863564466833981450/863564618215063573/spectator.png";

    public readonly description = dedent`
        A **Spectator** is a special role used internally to mark a player who has not been assigned their role.
    `;
}
