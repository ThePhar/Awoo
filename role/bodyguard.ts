import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Bodyguard extends Role {
  public readonly type = RoleType.Bodyguard;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly meta = null;
  public readonly description = "The Bodyguard chooses a player each night to protect from elimination. They must choose a different player each night, but may choose themselves.";
}
