import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Tanner extends Role {
  public readonly type = RoleType.Tanner;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Tanner;
  public readonly description = "The Tanner hates his job and his life. The Tanner wins if he is eliminated.";
}
