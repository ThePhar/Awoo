import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Witch extends Role {
  public readonly type = RoleType.Witch;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly description = "The Witch has the ability at night to protect any player chosen for elimination by the Werewolves or eliminate a player of their choosing. They may take these actions once per game each and may use them on the same night or on separate nights.";
}
