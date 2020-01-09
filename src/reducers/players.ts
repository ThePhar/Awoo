import produce from "immer";
import * as ActionType from "../interfaces/player-actions";
import Player from "../structs/player";
import { ROLE_ID } from "./meta";

type Actions = ActionType.PlayersAction | ActionType.PlayerActions;

export default function playersReducer(state: Array<Player> = [], action: Actions): Array<Player> {
    return produce(state, draft => {
        /* All players actions */
        if (action.type === ActionType.CLEAR_ALL_ACCUSATIONS) {
            draft.forEach(player => (player.accusing = null));
            return;
        }

        /* Single player actions */
        const playerAction = action as ActionType.PlayerAction;

        switch (playerAction.type) {
            case ActionType.ADD_PLAYER:
                playerAction.player.user.addRole(ROLE_ID);
                draft.push(playerAction.player);
                break;
            case ActionType.REMOVE_PLAYER:
                playerAction.player.user.removeRole(ROLE_ID);
                return draft.filter(player => player.id !== playerAction.player.id) as Array<Player>;
            case ActionType.ACCUSE_PLAYER:
                playerAction.player.accusing = (action as ActionType.PlayerTargetAction).target;
                break;
            case ActionType.ELIMINATE_PLAYER:
                playerAction.player.isAlive = false;
                playerAction.player.user.removeRole(ROLE_ID);
                break;
            case ActionType.TARGET_PLAYER:
                playerAction.player.target = (action as ActionType.PlayerTargetAction).target;
                break;
            case ActionType.PLAYER_CLEAR_TARGET:
                playerAction.player.target = null;
                break;
            case ActionType.ASSIGN_PLAYER_ROLE:
                playerAction.player.role = (action as ActionType.PlayerRoleAction).role;
                break;
        }
    });
}
