import { Action } from "redux";
import GameActionTypes from "./types";
import { GameThunkAction } from "../../types";
import Phase from "../../enum/phase";

export function gameStart(): Action {
  return { type: GameActionTypes.Start };
}

export function dayPhase(): Action {
  return { type: GameActionTypes.DayPhase };
}

export function nightPhase(): Action {
  return { type: GameActionTypes.NightPhase };
}

export const nextPhase = (): GameThunkAction => (dispatch, getState) => {
  const state = getState();

  if (state.phase === Phase.Pregame) {
    dispatch(gameStart());
  } else if (state.phase === Phase.Day) {
    dispatch(nightPhase());
  } else if (state.phase === Phase.Night) {
    dispatch(dayPhase());
  }
};
