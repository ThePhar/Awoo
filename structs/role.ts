import { Appearance, Color, MetaProperties, RoleType, Team } from "../types";
import { immerable } from "immer";

export interface RoleProperties {
  readonly appearance: Appearance;
  readonly defaultMeta: MetaProperties;
  readonly meta: MetaProperties;
  readonly team: Team;
  readonly type: RoleType;
  readonly werewolf: boolean;
}

export abstract class Role implements RoleProperties {
  [immerable] = true;

  public abstract readonly appearance: Appearance;
  public abstract readonly team: Team;
  public abstract readonly type: RoleType;

  public readonly defaultMeta: MetaProperties = {};
  public readonly meta: MetaProperties = {};
  public readonly werewolf: boolean = false;

  public get teamColor(): Color {
    switch (this.team) {
      case Team.Villagers:
        return Color.Blue;

      case Team.Werewolves:
        return Color.Red;

      case Team.Tanner:
        return Color.Brown;

      case Team.Vampires:
        return Color.Purple;

      case Team.CultLeader:
        return Color.Green;

      case Team.LoneWolf:
        return Color.Orange;

      case Team.Lovers:
        return Color.Pink;

      default:
        return Color.White;
    }
  }
}
