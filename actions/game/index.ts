import { Action } from "redux";
import GameActionTypes from "./types";

export function gameStart(): Action {
  return { type: GameActionTypes.GameStart };
}

export function nextPhase(): Action {
  return { type: GameActionTypes.NextPhase };
}
