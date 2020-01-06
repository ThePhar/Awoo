import produce from "immer";
import Player from "../structs/player";
import { ADD_PLAYER, PlayersActions, REMOVE_PLAYER } from "../interfaces/players-actions";

const initialState: Array<Player> = [];

export default function playersReducer(state: Array<Player> = initialState, action: PlayersActions): Array<Player> {
    return produce(state, draft => {
        switch (action.type) {
            case ADD_PLAYER:
                draft.push(action.player);
                break;
            case REMOVE_PLAYER:
                return draft.filter(player => player.client.id !== action.player.client.id) as Array<Player>;
        }
    });
}
