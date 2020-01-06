import produce from "immer";
import Player from "../structs/player";
import {
    ACCUSE_PLAYER,
    ADD_PLAYER,
    PlayersActions,
    PlayerTargetAction,
    READY_PLAYER,
    REMOVE_PLAYER,
} from "../interfaces/players-actions";

const initialState: Array<Player> = [];

export default function playersReducer(state: Array<Player> = initialState, action: PlayersActions): Array<Player> {
    return produce(state, draft => {
        switch (action.type) {
            case ADD_PLAYER:
                draft.push(action.player);
                break;
            case REMOVE_PLAYER:
                return draft.filter(player => player.client.id !== action.player.client.id) as Array<Player>;
            case READY_PLAYER:
                for (const player of draft) {
                    if (player.client.id === action.player.client.id) {
                        player.isReady = true;
                        break;
                    }
                }
                break;
            case ACCUSE_PLAYER:
                draft.forEach(player => {
                    const a = action as PlayerTargetAction;

                    if (player.client.id === action.player.client.id) {
                        player.accusing = a.target;
                    }
                });
                return;
        }
    });
}
