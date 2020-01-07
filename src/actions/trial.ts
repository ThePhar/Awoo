import {
    ACQUIT_VOTE,
    END_TRIAL_ACQUITTAL,
    END_TRIAL_LYNCHED,
    LYNCH_VOTE,
    RESET_TRIAL_STATE,
    START_TRIAL,
    TrialActions,
} from "../interfaces/trial-actions";
import Player from "../structs/player";

export function resetTrialState(): TrialActions {
    return {
        type: RESET_TRIAL_STATE,
    };
}
export function startTrial(accused: Player): TrialActions {
    return {
        type: START_TRIAL,
        player: accused,
    };
}
export function endTrialAcquittal(): TrialActions {
    return {
        type: END_TRIAL_ACQUITTAL,
    };
}
export function endTrialLynched(): TrialActions {
    return {
        type: END_TRIAL_LYNCHED,
    };
}
export function lynchVote(voter: Player): TrialActions {
    return {
        type: LYNCH_VOTE,
        player: voter,
    };
}
export function acquitVote(voter: Player): TrialActions {
    return {
        type: ACQUIT_VOTE,
        player: voter,
    };
}
