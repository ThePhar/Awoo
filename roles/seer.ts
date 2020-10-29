import { Appearance, MetaProperties, Role as RoleType, Team } from "../types";
import { Role } from "../structs";

export interface SeerMeta extends MetaProperties {
  target: string | null;
  inspected: { id: string, appearance: Appearance, dayInspected: number }[];
}

export class Seer extends Role {
  public readonly appearance = Appearance.Villager;
  public readonly defaultMeta: SeerMeta = { inspected: [], target: null };
  public readonly meta: SeerMeta = this.defaultMeta;
  public readonly team = Team.Villagers;
  public readonly type = RoleType.Seer;
}
