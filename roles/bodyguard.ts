import { Appearance } from "../constants/appearance";
import { Role } from "./base";
import { Roles } from "../constants/roles";
import { TeamDefinition, Teams } from "../constants/teams";

export default class Bodyguard extends Role {
    public override readonly appearance = Appearance.Villager;
    public override readonly type = Roles.Bodyguard;
    public override readonly team = Teams["Villagers"] as TeamDefinition;
}
