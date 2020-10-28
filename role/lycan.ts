import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Lycan extends Role {
  public readonly type = RoleType.Lycan;
  public readonly appearance = Appearance.Werewolf;
  public readonly team = Team.Villagers;
  public readonly meta = null;
  public readonly description = "The Lycan is cursed with a dormant strain of lycanthropy and appears to the Seer as a Werewolf.";
}
