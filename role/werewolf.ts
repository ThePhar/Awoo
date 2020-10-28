import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Werewolf extends Role {
  public readonly type = RoleType.Werewolf;
  public readonly appearance = Appearance.Werewolf;
  public readonly team = Team.Werewolves;
  public readonly meta = null;
  public readonly description = "Werewolves learn the identity of their fellow Werewolves on the first night. Each night after the first, the Werewolves will choose a target to be eliminated. The Werewolves try to keep their identity a secret from the Villagers.";
}
