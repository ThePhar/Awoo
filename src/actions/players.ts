import { ADD_PLAYER, REMOVE_PLAYER, READY_PLAYER, ACCUSE_PLAYER, PlayersActions } from "../interfaces/players-actions";
import Player from "../structs/player";

export function addPlayer(player: Player): PlayersActions {
    return {
        type: ADD_PLAYER,
        player,
    };
}
export function removePlayer(player: Player): PlayersActions {
    return {
        type: REMOVE_PLAYER,
        player,
    };
}
export function readyPlayer(player: Player): PlayersActions {
    return {
        type: READY_PLAYER,
        player,
    };
}
export function accusePlayer(player: Player, target: Player): PlayersActions {
    return {
        type: ACCUSE_PLAYER,
        player,
        target,
    };
}
