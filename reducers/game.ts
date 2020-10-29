import produce, { Draft } from "immer";
import { AnyAction } from "redux";
import { AnyPlayerAction } from "../actions/player/interfaces";
import Game from "../structs/game";
import GameActionTypes from "../actions/game/types";
import { Identifier } from "../types";
import Phase from "../enum/phase";
import Player from "../structs/player";
import PlayerActionTypes from "../actions/player/types";
import playerReducer from "./player";

const gameReducer = (game: Game, action: AnyAction): Game => produce(game, (state: Draft<Game>) => {
  switch (action.type) {
    /** Add a player to the game. */
    case PlayerActionTypes.Join:
      if (!action.id || !action.name)
        throw new Error("Attempting to reduce add player action with invalid action.");

      state.players.set(action.id, new Player({
        id: action.id as Identifier,
        name: action.name as string
      }));
      break;

    /** Remove a player from the game. */
    case PlayerActionTypes.Leave:
      if (!action.id)
        throw new Error("Attempting to reduce remove player action with invalid action.");

      state.players.delete(action.id as Identifier);
      break;

    /** Set the phase to start on day 1 and Night Phase. */
    case GameActionTypes.Start:
      state.phase = Phase.Night;
      state.day = 1;
      break;

    /** Start the day phase. */
    case GameActionTypes.DayPhase:
      state.phase = Phase.Day;
      break;

    /** Start the night phase. */
    case GameActionTypes.NightPhase:
      state.phase = Phase.Night;
      state.day += 1;
      break;
  }

  // Fire any player actions as well.
  if (action.id) {
    const player = state.players.get(action.id);

    if (player)
      state.players.set(action.id, playerReducer(player, action as AnyPlayerAction));
  }

  // Push this action to the game's history.
  state.history.push({ action, timestamp: Date.now() });
});

export default gameReducer;
