/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Draft, produce } from "immer";
import { Game, Player } from "../structs";
import { AnyAction } from "redux";
import { GameActionType } from "../actions";
import { Phase } from "../types";
import { playerReducer } from "./player";

export const gameReducer = (game: Game, action: AnyAction): Game => produce(game, (state: Draft<Game>) => {
  switch (action.type) {
    case GameActionType.StartDay:
      state.phase = Phase.Day;
      break;

    case GameActionType.StartNight:
      state.phase = Phase.Night;
      state.day += 1;
      break;

    case GameActionType.End:
      state.phase = Phase.Endgame;
      break;

    case GameActionType.AddPlayer:
      state.players.set(action.id, new Player(action.id, action.name));
      break;

    case GameActionType.RemovePlayer:
      state.players.delete(action.id);
      break;

    case GameActionType.AddPrompt:
      state.prompts.add(action.id);
      break;

    case GameActionType.RemovePrompt:
      state.prompts.delete(action.id);
      break;
  }

  // Fire any player actions as well.
  if (action.id) {
    const player = state.players.get(action.id);

    if (player)
      state.players.set(action.id, playerReducer(player, action));
  }

  // Push this action to the game's history.
  state.history.push({ action, timestamp: Date.now() });
});
