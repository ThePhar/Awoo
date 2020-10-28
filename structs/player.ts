import { Accusing, Identifier, SkipVote } from "../types";
import { Draft, immerable } from "immer";
import { AnyAction } from "redux";
import Flags from "./flags";
import PlayerActionTypes from "../actions/player/types";
import Role from "./role";
import { Villager } from "../role";
import { VoteAction } from "../actions/player/interfaces";

export interface PlayerProperties {
  readonly id: Identifier;
  readonly accusing?: Accusing;
  readonly flags?: Flags;
  readonly role?: Role;
}

export default class Player implements PlayerProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly accusing: Accusing;
  public readonly flags: Flags;
  public readonly role: Role;

  public constructor({ id, accusing, flags, role }: PlayerProperties) {
    this.id = id;
    this.accusing = accusing || null;
    this.flags = flags || { alive: true, werewolf: false };
    this.role = role || new Villager();
  }

  /**
   * Return a new Draft<Player> object that updates from a predefined action.
   * @param {Draft<Player>} player - The player to base our drafts from.
   * @param {AnyAction} action - Action to take on the player.
   */
  public static reduce(player: Draft<Player>, action: AnyAction): Draft<Player> {
    switch (action.type) {
      case PlayerActionTypes.Vote:
        player.accusing = (action as VoteAction).accusing;
        break;

      case PlayerActionTypes.NoVote:
        player.accusing = SkipVote;
        break;

      case PlayerActionTypes.ClearVote:
        player.accusing = null;
        break;
    }

    // Fire the reducer on our role as well.
    const RoleClass = player.role.constructor as typeof Role;
    player.role = RoleClass.reduce(player.role, action);

    return player;
  }
}
