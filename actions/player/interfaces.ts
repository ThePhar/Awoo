import { AnyAction } from "redux";
import Elimination from "../../enum/elimination";
import { Identifier } from "../../types";
import PlayerActionTypes from "./types";

export interface PlayerAction extends AnyAction {
  readonly type: PlayerActionTypes;
  readonly id: Identifier;
}

export interface VoteAction extends PlayerAction {
  readonly accusing: Identifier;
}

export interface EliminationAction extends PlayerAction {
  readonly reason: Elimination;
}

export type AnyPlayerAction = PlayerAction | VoteAction | EliminationAction;
