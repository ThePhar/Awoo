import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Villager extends Role {
  public readonly type = RoleType.Villager;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly description = "The Villagers' sole purpose is to find the werewolves and eliminate them.";
}
