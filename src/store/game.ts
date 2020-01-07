import { createStore, combineReducers } from "redux";
import metaReducer from "../reducers/meta";
import playersReducer from "../reducers/players";
import trialReducer from "../reducers/trial";

export function initializeGame(): ReturnType<typeof createStore> {
    return createStore(
        combineReducers({
            meta: metaReducer,
            players: playersReducer,
            trial: trialReducer,
        }),
    );
}
