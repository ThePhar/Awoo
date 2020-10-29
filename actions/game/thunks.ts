import { GameThunkAction, Phase } from "../../types";
import { gameStartDay, gameStartNight } from "./creators";

export const nextPhase = (): GameThunkAction => (dispatch, getState) => {
  const state = getState();

  if (state.phase === Phase.Pregame || state.phase === Phase.Day) {
    dispatch(gameStartNight());
  } else if (state.phase === Phase.Night) {
    dispatch(gameStartDay());
  }
};
