import produce from "immer";
import Player from "../structs/player";
import {
    ACCUSE_PLAYER,
    ADD_PLAYER,
    ASSIGN_PLAYER_ROLE,
    CLEAR_TARGET_PLAYER,
    ELIMINATE_PLAYER,
    PlayerRoleAction,
    PlayersActions,
    PlayerTargetAction,
    READY_PLAYER,
    REMOVE_PLAYER,
    RESET_PLAYER_CHOICES,
    TARGET_PLAYER,
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

            case RESET_PLAYER_CHOICES:
                action.player.resetChoices();
                break;

            case ASSIGN_PLAYER_ROLE:
                action.player.role = (action as PlayerRoleAction).role;
                break;
        }
    });
}
