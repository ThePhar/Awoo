import { Appearance } from "../constants/appearance";
import { Role } from "./base";
import { Roles } from "../constants/roles";
import { TeamDefinition, Teams } from "../constants/teams";

export default class Sorceress extends Role {
    public override readonly appearance = Appearance.Villager;
    public override readonly type = Roles.Sorceress;
    public override readonly team = Teams["Werewolves"] as TeamDefinition;
}
