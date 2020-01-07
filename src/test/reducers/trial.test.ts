import { createStore } from "redux";
import Trial from "../../structs/trial";
import trialReducer from "../../reducers/trial";
import {
    acquitVote,
    endTrialAcquittal,
    endTrialLynched,
    lynchVote,
    resetTrialState,
    startTrial,
} from "../../actions/trial";
import { createTestPlayer } from "../fixtures/player";

let store: ReturnType<typeof createStore>;
beforeEach(() => {
    store = createStore(trialReducer);
});

it("should create an initial trial object on store creation", () => {
    expect(store.getState()).toBeInstanceOf(Trial);
});

describe("Action handlers", () => {
    it("when START_TRIAL is fired, set accused player and active", () => {
        const player = createTestPlayer();
        store.dispatch(startTrial(player));

        const state = store.getState() as Trial;
        expect(state.accused).toBe(player);
        expect(state.active).toBe(true);
    });
    it("when END_TRIAL_ACQUITTAL is fired, reset votes, disable active, and add player to immune list", () => {
        const player = createTestPlayer();

        store.dispatch(startTrial(player));
        store.dispatch(endTrialAcquittal());

        const state = store.getState() as Trial;
        expect(state.lynchVotes.length).toBe(0);
        expect(state.acquitVotes.length).toBe(0);
        expect(state.active).toBe(false);
        expect(state.accused).toBe(null);
        expect(state.immune[0]).toBe(player);
    });
    it("when END_TRIAL_LYNCHED is fired, set startable to false and end trial active", () => {
        const player = createTestPlayer();

        store.dispatch(startTrial(player));
        store.dispatch(endTrialLynched());

        const state = store.getState() as Trial;
        expect(state.active).toBe(false);
        expect(state.startable).toBe(false);
    });
    it("throw an error if END_TRIAL_ACQUITTAL is called if trial not active", () => {
        expect(() => store.dispatch(endTrialAcquittal())).toThrow();
    });
    it("when LYNCH_VOTE is fired, add player to lynch votes array", () => {
        const player = createTestPlayer();

        store.dispatch(lynchVote(player));

        const state = store.getState() as Trial;
        expect(state.lynchVotes[0]).toBe(player);
        expect(state.lynchVotes.length).toBe(1);
    });
    it("when ACQUIT_VOTE is fired, add player to acquit votes array", () => {
        const player = createTestPlayer();

        store.dispatch(acquitVote(player));

        const state = store.getState() as Trial;
        expect(state.acquitVotes[0]).toBe(player);
        expect(state.acquitVotes.length).toBe(1);
    });
    it("when RESET_TRIAL_STATE is fired, replace state with new trial object", () => {
        const player = createTestPlayer();

        store.dispatch(startTrial(player));
        store.dispatch(lynchVote(player));
        store.dispatch(acquitVote(player));
        store.dispatch(endTrialLynched());

        store.dispatch(resetTrialState());

        const state = store.getState() as Trial;
        expect(state).toStrictEqual(new Trial());
    });
});
