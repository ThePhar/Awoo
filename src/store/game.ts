import { createStore, combineReducers } from "redux";
import metaReducer from "../reducers/meta";
import playersReducer from "../reducers/players";

export type GameStore = ReturnType<typeof createStore>;

export function initializeGame(): GameStore {
    return createStore(
        combineReducers({
            meta: metaReducer,
            players: playersReducer,
        }),
    );
}
