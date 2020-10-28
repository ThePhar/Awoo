import { Accusing, Identifier } from "../types";
import { Draft, immerable } from "immer";
import { AnyAction } from "redux";
import Role from "./role";
import { Villager } from "../role";

export interface PlayerProperties {
  readonly id: Identifier;
  readonly accusing?: Accusing;
  readonly flags?: unknown;
  readonly role?: Role;
}

export default class Player implements PlayerProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly accusing: Accusing;
  public readonly flags: unknown; // TODO: Create struct.
  public readonly role: Role;

  public constructor({ id, accusing, flags, role }: PlayerProperties) {
    this.id = id;
    this.accusing = accusing || null;
    this.flags = flags;
    this.role = role || new Villager();
  }

  /**
   * Return a new Draft<Player> object that updates from a predefined action.
   * @param {Draft<Player>} player - The player to base our drafts from.
   * @param {AnyAction} action - Action to take on the player.
   */
  public static reduce(player: Draft<Player>, action: AnyAction): Draft<Player> {
    switch (action.type) {
      default:
        break;
    }

    // Fire the reducer on our role as well.
    const RoleClass = player.role.constructor as typeof Role;
    player.role = RoleClass.reduce(player.role, action);

    return player;
  }
}
