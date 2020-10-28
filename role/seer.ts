import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Seer extends Role {
  public readonly type = RoleType.Seer;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly meta = null;
  public readonly description = "The Seer chooses a player each night to learn if they are a Werewolf or a Villager.";
}
