import { Draft, immerable } from "immer";
import { AnyAction } from "redux";
import { AnyPrimitive } from "../types";
import Appearance from "../enum/appearance";
import Color from "../enum/color";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export interface RoleProperties {
  readonly type: RoleType;
  readonly appearance: Appearance;
  readonly team: Team;
  readonly meta: AnyPrimitive;
  readonly description: string;
}

export default abstract class Role implements RoleProperties {
  [immerable] = true;

  public abstract readonly type: RoleType;
  public abstract readonly appearance: Appearance;
  public abstract readonly team: Team;
  public abstract readonly meta: AnyPrimitive;
  public abstract readonly description: string;

  public get teamColor(): Color {
    switch (this.team) {
      case Team.Villagers:
        return Color.Blue;

      case Team.Werewolves:
        return Color.Red;

      case Team.Tanner:
        return Color.Brown;

      default:
        return Color.White;
    }
  }

  /**
   * Return a new Draft<Role> object that updates from a predefined action. These are actions all
   * roles' reducers can interpret.
   * @param {Draft<Role>} role - The role to base our drafts from.
   * @param {AnyAction} action - Action to take on the role.
   */
  public static reduce(role: Draft<Role>, action: AnyAction): Draft<Role> {
    switch (action.type) {
      default:
        return role;
    }
  }
}
