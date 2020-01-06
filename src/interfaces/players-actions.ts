import Player from "../structs/player";

export const ADD_PLAYER = "ADD_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";
export const READY_PLAYER = "READY_PLAYER";
export const ACCUSE_PLAYER = "ACCUSE_PLAYER";

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
