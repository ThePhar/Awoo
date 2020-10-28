import { AnyAction } from "redux";
import { Identifier } from "../../types";
import PlayerActionTypes from "./types";

export interface PlayerAction extends AnyAction {
  readonly type: PlayerActionTypes;
  readonly id: Identifier;
}

export interface VoteAction extends PlayerAction {
  readonly accusing: Identifier;
}

export type AnyPlayerAction = PlayerAction | VoteAction;
