import { EliminationAction, NamedPlayerAction, PlayerAction, VoteAction } from "./interfaces";
import Elimination from "../../enum/elimination";
import { Identifier } from "../../types";
import PlayerActionTypes from "./types";

export function playerJoin(id: Identifier, name: string): NamedPlayerAction {
  return { type: PlayerActionTypes.Join, id, name };
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

export function playerEliminate(id: Identifier, reason: Elimination): EliminationAction {
  return { type: PlayerActionTypes.Eliminate, id, reason };
}
