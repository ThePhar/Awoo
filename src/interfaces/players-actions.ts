import Player from "../structs/player";

export const ADD_PLAYER = "ADD_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";
export const READY_PLAYER = "READY_PLAYER";

interface PlayerAction {
    type: string;
    player: Player;
}

export type PlayersActions = PlayerAction;
