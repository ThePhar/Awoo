import Player from "../structs/player";

export const RESET_TRIAL_STATE = "RESET_TRIAL_STATE";
export const START_TRIAL = "START_TRIAL";
export const END_TRIAL_ACQUITTAL = "END_TRIAL_ACQUITTAL";
export const END_TRIAL_LYNCHED = "END_TRIAL_LYNCHED";
export const LYNCH_VOTE = "LYNCH_VOTE";
export const ACQUIT_VOTE = "ACQUIT_VOTE";

export interface TrialSimpleAction {
    type: string;
}
export interface TrialPlayerAction {
    type: string;
    player: Player;
}

export type TrialActions = TrialSimpleAction | TrialPlayerAction;
