import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Sorceress extends Role {
  public readonly type = RoleType.Sorceress;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Werewolves;
  public readonly description = "Each night, the Sorceress chooses a player and learns if they are the Seer. The Sorceress is on the Werewolf team.";
}
