import { Accusing, Identifier } from "../types";
import { Draft, immerable } from "immer";
import { AnyAction } from "redux";

export interface PlayerProperties {
  readonly id: Identifier;
  readonly accusing?: Accusing;
  readonly flags?: unknown;
  readonly role?: unknown;
}

export default class Player implements PlayerProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly accusing: Accusing;
  public readonly flags: unknown; // TODO: Create struct.
  public readonly role: unknown; // TODO: Create struct.

  public constructor({ id, accusing, flags, role }: PlayerProperties) {
    this.id = id;
    this.accusing = accusing || null;
    this.flags = flags;
    this.role = role;
  }

  /**
   * Return a new Draft<Player> object that updates from a predefined action.
   * @param {Draft<Player>} player - The player to base our drafts from.
   * @param {AnyAction} action - Action to take on game.
   */
  public static reduce(player: Draft<Player>, action: AnyAction): Draft<Player> {
    switch (action.type) {
      default:
        return player;
    }
  }
}
