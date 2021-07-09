import { Appearance } from "../constants/appearance";
import { Role } from "./base";
import { Roles } from "../constants/roles";
import { TeamDefinition, Teams } from "../constants/teams";

export default class Tanner extends Role {
    public override readonly appearance = Appearance.Villager;
    public override readonly type = Roles.Tanner;
    public override readonly team = Teams["Tanner"] as TeamDefinition;
}
