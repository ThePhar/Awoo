import * as ActionType from "../interfaces/player-actions";
import Role from "../interfaces/role";
import Player from "../structs/player";

export function addPlayer(player: Player): ActionType.PlayerActions {
    return {
        type: ActionType.ADD_PLAYER,
        player,
    };
}
export function removePlayer(player: Player): ActionType.PlayerActions {
    return {
        type: ActionType.REMOVE_PLAYER,
        player,
    };
}
export function accusePlayer(player: Player, target: Player): ActionType.PlayerActions {
    return {
        type: ActionType.ACCUSE_PLAYER,
        player,
        target,
    };
}
export function eliminatePlayer(player: Player): ActionType.PlayerActions {
    return {
        type: ActionType.ELIMINATE_PLAYER,
        player,
    };
}
export function targetPlayer(player: Player, target: Player): ActionType.PlayerActions {
    return {
        type: ActionType.TARGET_PLAYER,
        player,
        target,
    };
}
export function playerClearTarget(player: Player): ActionType.PlayerActions {
    return {
        type: ActionType.PLAYER_CLEAR_TARGET,
        player,
    };
}
export function clearAllAccusations(): ActionType.PlayersAction {
    return {
        type: ActionType.CLEAR_ALL_ACCUSATIONS,
    };
}
export function assignPlayerRole(player: Player, role: Role): ActionType.PlayerActions {
    return {
        type: ActionType.ASSIGN_PLAYER_ROLE,
        player,
        role,
    };
}
