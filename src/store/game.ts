import { createStore, combineReducers } from "redux";
import metaReducer from "../reducers/meta";
import playersReducer from "../reducers/players";
import Meta from "../structs/meta";
import Player from "../structs/player";

export type GameStore = ReturnType<typeof createStore>;
export interface GameState {
    meta: Meta;
    players: Array<Player>;
}

export function initializeGame(): GameStore {
    return createStore(
        combineReducers({
            meta: metaReducer,
            players: playersReducer,
        }),
    );
}
