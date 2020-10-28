import { Action } from "redux";
import { Identifier } from "../../types";

export interface PlayerAction extends Action {
  id: Identifier;
}

export interface VoteAction extends PlayerAction {
  accusing: Identifier;
}
