import { Appearance, MetaProperties, Role as RoleType, Team } from "../types";
import { Role } from "../structs";

interface WerewolfMeta extends MetaProperties {
  target: string | null;
}

export class Werewolf extends Role {
  public readonly appearance = Appearance.Werewolf;
  public readonly defaultMeta: WerewolfMeta = { target: null };
  public readonly meta: WerewolfMeta = this.defaultMeta;
  public readonly team = Team.Werewolves;
  public readonly type = RoleType.Werewolf;
  public readonly werewolf = true;
}
