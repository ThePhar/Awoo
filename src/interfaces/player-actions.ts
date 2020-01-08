import Player from "../structs/player";
import Role from "./role";

export const ADD_PLAYER = "ADD_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";
export const READY_PLAYER = "READY_PLAYER";
export const ACCUSE_PLAYER = "ACCUSE_PLAYER";
export const ELIMINATE_PLAYER = "ELIMINATE_PLAYER";
export const TARGET_PLAYER = "TARGET_PLAYER";
export const PLAYER_CLEAR_TARGET = "PLAYER_CLEAR_TARGET";
export const CLEAR_ALL_ACCUSATIONS = "CLEAR_ALL_ACCUSATIONS";
export const ASSIGN_PLAYER_ROLE = "ASSIGN_PLAYER_ROLE";

export interface PlayersAction {
    type: string;
}

export interface PlayerAction {
    type: string;
    player: Player;
}
export interface PlayerTargetAction {
    type: string;
    player: Player;
    target: Player;
}
export interface PlayerRoleAction {
    type: string;
    player: Player;
    role: Role;
}

export type PlayerActions = PlayerAction | PlayerTargetAction | PlayerRoleAction;
