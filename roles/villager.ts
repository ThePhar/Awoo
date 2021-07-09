import { Role } from "../role";
import { Roles } from "../constants/roles";
import { Teams } from "../constants/teams";

export class Villager extends Role {
    public override readonly type = Roles.Villager;
    public override readonly team = Teams[this.type];
}
