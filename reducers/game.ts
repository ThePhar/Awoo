import produce, { Draft } from "immer";
import { AnyAction } from "redux";
import Game from "../structs/game";
import GameActionTypes from "../actions/game/types";
import Phase from "../enum/phase";
import Player from "../structs/player";
import { PlayerAction } from "../actions/player/structs";
import PlayerActionTypes from "../actions/player/types";
import playerReducer from "./player";

const gameReducer = (game: Game, action: AnyAction): Game => produce(game, (state: Draft<Game>) => {
  switch (action.type) {
    /** Add a player to the game. */
    case PlayerActionTypes.Join:
      if (!(action instanceof PlayerAction))
        throw new Error("Attempting to reduce add player action with invalid action.");

      state.players.set(action.id, new Player({ id: action.id }));
      break;

    /** Remove a player from the game. */
    case PlayerActionTypes.Leave:
      if (!(action instanceof PlayerAction))
        throw new Error("Attempting to reduce remove player action with invalid action.");

      state.players.delete(action.id);
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
  if (action instanceof PlayerAction) {
    const player = state.players.get(action.id);

    if (player)
      state.players.set(action.id, playerReducer(player, action));
  }

  // Push this action to the game's history.
  state.history.push({ action, timestamp: Date.now() });
});

export default gameReducer;
