import { createStore, combineReducers } from "redux";
import metaReducer from "../reducers/meta";
import playersReducer from "../reducers/players";

export function initializeGame(): ReturnType<typeof createStore> {
    return createStore(
        combineReducers({
            meta: metaReducer,
            players: playersReducer,
        }),
    );
}
