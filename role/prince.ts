import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Prince extends Role {
  public readonly type = RoleType.Prince;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly description = "If the village chooses to lynch the Prince, his role is revealed and he is not eliminated.";
}
