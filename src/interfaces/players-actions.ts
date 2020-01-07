import Player from "../structs/player";
import Role from "./role";

export const ADD_PLAYER = "ADD_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";
export const READY_PLAYER = "READY_PLAYER";
export const ACCUSE_PLAYER = "ACCUSE_PLAYER";
export const ELIMINATE_PLAYER = "ELIMINATE_PLAYER";
export const TARGET_PLAYER = "TARGET_PLAYER";
export const CLEAR_TARGET_PLAYER = "CLEAR_TARGET_PLAYER";
export const VOTE_PLAYER = "VOTE_PLAYER";
export const RESET_PLAYER_CHOICES = "RESET_PLAYER_CHOICES";
export const ASSIGN_PLAYER_ROLE = "ASSIGN_PLAYER_ROLE";

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

export type PlayersActions = PlayerAction | PlayerTargetAction | PlayerRoleAction;
