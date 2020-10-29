import { Elimination, Role } from "../../types";
import { Action } from "redux";

export type AnyPlayerAction = PlayerAction | VoteAction | EliminationAction | NamedPlayerAction;

export interface PlayerAction extends Action {
  readonly id: string;
}

export interface NamedPlayerAction extends PlayerAction {
  readonly name: string;
}

export interface VoteAction extends PlayerAction {
  readonly accusing: string;
}

export interface EliminationAction extends PlayerAction {
  readonly reason: Elimination;
}

export interface RoleAssignAction extends PlayerAction {
  readonly role: Role;
}
