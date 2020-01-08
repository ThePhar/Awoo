import { createStore } from "redux";
import Meta from "../../structs/meta";
import Phases from "../../structs/phases";
import * as ActionCreator from "../../actions/meta";
import metaReducer from "../../reducers/meta";
import { createStubTextChannel } from "../_stubs/channels";

/* Test Fixtures */
const stubChannel = createStubTextChannel();

let store: ReturnType<typeof createStore>;
beforeEach(() => {
    store = createStore(metaReducer);
});

it("should on LINK_NOTIFICATION_CHANNEL, link channel to notificationChannel field", () => {
    store.dispatch(ActionCreator.linkNotificationChannel(stubChannel));

    const state = store.getState() as Meta;
    expect(state.notificationChannel).toBe(stubChannel);
});
it("should on LINK_DISCUSSION_CHANNEL, link channel to discussionChannel field", () => {
    store.dispatch(ActionCreator.linkDiscussionChannel(stubChannel));

    const state = store.getState() as Meta;
    expect(state.discussionChannel).toBe(stubChannel);
});
it("should on START_DAY_PHASE, set phase to `day`", () => {
    store.dispatch(ActionCreator.startDayPhase());

    const state = store.getState() as Meta;
    expect(state.phase).toBe(Phases.Day);
});
it("should on START_NIGHT_PHASE, set phase to `night` and increment day field", () => {
    store.dispatch(ActionCreator.startNightPhase());

    const state = store.getState() as Meta;
    expect(state.phase).toBe(Phases.Night);
    expect(state.day).toBe(1);
});
it("should set lastActionFired to last action fired", () => {
    const testAction = { type: "TEST_ACTION" };
    store.dispatch(testAction);

    const state = store.getState() as Meta;
    expect(state.lastActionFired).toBe(testAction);
});
