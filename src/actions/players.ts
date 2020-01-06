import {
    ADD_PLAYER,
    REMOVE_PLAYER,
    READY_PLAYER,
    ACCUSE_PLAYER,
    PlayersActions,
    ELIMINATE_PLAYER,
    TARGET_PLAYER,
    CLEAR_TARGET_PLAYER,
    VOTE_PLAYER,
    RESET_PLAYER_CHOICES,
} from "../interfaces/players-actions";
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
export function eliminatePlayer(player: Player): PlayersActions {
    return {
        type: ELIMINATE_PLAYER,
        player,
    };
}
export function targetPlayer(player: Player, target: Player): PlayersActions {
    return {
        type: TARGET_PLAYER,
        player,
        target,
    };
}
export function playerClearTarget(player: Player): PlayersActions {
    return {
        type: CLEAR_TARGET_PLAYER,
        player,
    };
}
export function playerVote(player: Player): PlayersActions {
    return {
        type: VOTE_PLAYER,
        player,
    };
}
export function resetPlayerChoices(player: Player): PlayersActions {
    return {
        type: RESET_PLAYER_CHOICES,
        player,
    };
}
