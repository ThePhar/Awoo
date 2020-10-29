/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AnyAction } from "redux";
import { Draft } from "immer";
import { Player } from "../structs";
import { PlayerActionType } from "../actions";
import { SkipVote } from "../types";
import { Villager } from "../roles";

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
      // TODO: Write role getter logic.
      player.role = new Villager();
      break;
  }

  // TODO: Add role logic here.

  return player;
};
