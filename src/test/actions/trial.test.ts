import {
    acquitVote,
    endTrialAcquittal,
    endTrialLynched,
    lynchVote,
    resetTrialState,
    startTrial,
} from "../../actions/trial";
import {
    ACQUIT_VOTE,
    END_TRIAL_ACQUITTAL,
    END_TRIAL_LYNCHED,
    LYNCH_VOTE,
    RESET_TRIAL_STATE,
    START_TRIAL,
    TrialPlayerAction,
} from "../../interfaces/trial-actions";
import { createTestPlayer } from "../fixtures/player";

it("should return an action for resetting the trial state", () => {
    const action = resetTrialState();

    expect(action.type).toBe(RESET_TRIAL_STATE);
});
it("should return an action for starting the trial phase", () => {
    const player = createTestPlayer();
    const action = startTrial(player) as TrialPlayerAction;

    expect(action.type).toBe(START_TRIAL);
    expect(action.player).toBe(player);
});
it("should return an action for ending a trial via acquittal", () => {
    const action = endTrialAcquittal();

    expect(action.type).toBe(END_TRIAL_ACQUITTAL);
});
it("should return an action for ending a trial via lynching", () => {
    const action = endTrialLynched();

    expect(action.type).toBe(END_TRIAL_LYNCHED);
});
it("should return an action for a lynch vote", () => {
    const player = createTestPlayer();
    const action = lynchVote(player) as TrialPlayerAction;

    expect(action.type).toBe(LYNCH_VOTE);
    expect(action.player).toBe(player);
});
it("should return an action for a acquit vote", () => {
    const player = createTestPlayer();
    const action = acquitVote(player) as TrialPlayerAction;

    expect(action.type).toBe(ACQUIT_VOTE);
    expect(action.player).toBe(player);
});
