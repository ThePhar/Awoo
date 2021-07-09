import { Appearance } from "../constants/appearance";
import { Role } from "./base";
import { Roles } from "../constants/roles";
import { TeamDefinition, Teams } from "../constants/teams";

export default class Werewolf extends Role {
    public override readonly appearance = Appearance.Werewolf;
    public override readonly type = Roles.Werewolf;
    public override readonly team = Teams["Werewolves"] as TeamDefinition;
}
