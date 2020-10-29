import { Appearance, RoleType as RoleType, Team } from "../types";
import { Role } from "../structs/role";

export class Villager extends Role {
  public readonly appearance = Appearance.Villager;
  public readonly team = Team.Villagers;
  public readonly type = RoleType.Villager;

  public readonly description = "The Villagers' sole purpose is to find the werewolves and eliminate them.";
}
