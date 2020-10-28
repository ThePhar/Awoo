import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export class Mason extends Role {
  public readonly type = RoleType.Mason;
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly description = "The Masons are a secret society of Villagers founded to manage the village from the shadows. They learn the identity of their fellow Masons, and if any player mentions 'secret societies' or 'masons' in public they are eliminated the following night.";
}
