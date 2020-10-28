import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Hunter extends Role {
  public readonly type = RoleType.Hunter;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly description = "The Hunter chooses a target to eliminate if they are eliminated as well. They can change their target at any time.";
}
