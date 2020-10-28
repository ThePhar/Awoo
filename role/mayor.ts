import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Mayor extends Role {
  public readonly type = RoleType.Mayor;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly meta = null;
  public readonly description = "The Mayor's vote counts twice in all votes to lynch or not lynch players.";
}
