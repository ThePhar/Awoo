import produce from "immer";
import Player from "../structs/player";
import {
    ACCUSE_PLAYER,
    ADD_PLAYER,
    READY_PLAYER,
    REMOVE_PLAYER,
    PlayersActions,
    PlayerTargetAction,
    ELIMINATE_PLAYER,
    TARGET_PLAYER,
    CLEAR_TARGET_PLAYER,
    VOTE_PLAYER,
    RESET_PLAYER_CHOICES,
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
                action.player.isReady = true;
                break;

            case ACCUSE_PLAYER:
                action.player.accusing = (action as PlayerTargetAction).target;
                break;

            case ELIMINATE_PLAYER:
                action.player.isAlive = false;
                break;

            case TARGET_PLAYER:
                action.player.target = (action as PlayerTargetAction).target;
                break;

            case CLEAR_TARGET_PLAYER:
                action.player.target = null;
                break;

            case VOTE_PLAYER:
                action.player.hasVoted = true;
                break;

            case RESET_PLAYER_CHOICES:
                action.player.resetChoices();
                break;
        }
    });
}
