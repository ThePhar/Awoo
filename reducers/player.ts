import { PlayerAction, VoteAction } from "../actions/player/structs";
import { Draft } from "immer";
import Player from "../structs/player";
import PlayerActionTypes from "../actions/player/types";
import { SkipVote } from "../types";

const playerReducer = (player: Draft<Player>, action: PlayerAction): Draft<Player> => {
  switch (action.type) {
    /** Vote to eliminate a player. */
    case PlayerActionTypes.Vote:
      if (!(action instanceof VoteAction))
        throw new Error("Attempting to reduce vote action with invalid action.");

      player.accusing = action.accusing;
      break;

    /** Vote to not eliminate any player. */
    case PlayerActionTypes.NoVote:
      player.accusing = SkipVote;
      break;

    /** Clear a player's votes to eliminate or not eliminate. */
    case PlayerActionTypes.ClearVote:
      player.accusing = null;
      break;
  }

  // TODO: Add role logic here.

  return player;
};

export default playerReducer;
