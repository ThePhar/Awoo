import { AnyAction } from "redux";
import Elimination from "../../enum/elimination";
import { Identifier } from "../../types";

export interface PlayerAction extends AnyAction {
  readonly id: Identifier;
}

export interface NamedPlayerAction extends PlayerAction {
  readonly name: string;
}

export interface VoteAction extends PlayerAction {
  readonly accusing: Identifier;
}

export interface EliminationAction extends PlayerAction {
  readonly reason: Elimination;
}

export type AnyPlayerAction = PlayerAction | VoteAction | EliminationAction | NamedPlayerAction;
