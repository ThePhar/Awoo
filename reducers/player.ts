/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AnyAction } from "redux";
import { Draft } from "immer";
import { Player } from "../structs/player";
import { PlayerActionType } from "../actions/player/types";
import { SkipVote } from "../types";
import { getRole } from "../roles";

export const playerReducer = (player: Draft<Player>, action: AnyAction): Draft<Player> => {
  switch (action.type) {
    case PlayerActionType.Eliminate:
      player.alive = false;
      break;

    case PlayerActionType.VoteLynch:
      player.accusing = action.accusing;
      break;

    case PlayerActionType.VoteSkip:
      player.accusing = SkipVote;
      break;

    case PlayerActionType.ClearVote:
      player.accusing = null;
      break;

    case PlayerActionType.AssignRole:
      player.role = getRole(action.role);
      break;
  }

  // TODO: Add role logic here.

  return player;
};
