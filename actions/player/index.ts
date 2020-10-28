import { PlayerAction, VoteAction } from "./interfaces";
import { Identifier } from "../../types";
import PlayerActionTypes from "./types";

export function playerJoin(id: Identifier): PlayerAction {
  return { type: PlayerActionTypes.Join, id };
}

export function playerLeave(id: Identifier): PlayerAction {
  return { type: PlayerActionTypes.Leave, id };
}

export function playerVote(accuser: Identifier, accusing: Identifier): VoteAction {
  return { type: PlayerActionTypes.Vote, id: accuser, accusing };
}

export function playerSkipVote(id: Identifier): PlayerAction {
  return { type: PlayerActionTypes.NoVote, id };
}

export function playerClearVote(id: Identifier): PlayerAction {
  return { type: PlayerActionTypes.ClearVote, id };
}
