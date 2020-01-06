import Player from "../structs/player";

export const ADD_PLAYER = "ADD_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";
export const READY_PLAYER = "READY_PLAYER";
export const ACCUSE_PLAYER = "ACCUSE_PLAYER";
export const ELIMINATE_PLAYER = "ELIMINATE_PLAYER";
export const TARGET_PLAYER = "TARGET_PLAYER";
export const CLEAR_TARGET_PLAYER = "CLEAR_TARGET_PLAYER";
export const VOTE_PLAYER = "VOTE_PLAYER";
export const RESET_PLAYER_CHOICES = "RESET_PLAYER_CHOICES";

export interface PlayerAction {
    type: string;
    player: Player;
}
export interface PlayerTargetAction {
    type: string;
    player: Player;
    target: Player;
}

export type PlayersActions = PlayerAction | PlayerTargetAction;
