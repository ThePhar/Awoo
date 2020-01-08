import * as ActionCreator from "../../actions/meta";
import * as ActionType from "../../interfaces/meta-actions";
import { createStubTextChannel } from "../_stubs/channels";

/* Test Fixtures */
const stubChannel = createStubTextChannel();

it("should return an action object for linkNotificationChannel", () => {
    const action = ActionCreator.linkNotificationChannel(stubChannel) as ActionType.MetaChannelAction;

    expect(action.type).toBe(ActionType.LINK_NOTIFICATION_CHANNEL);
    expect(action.channel).toBe(stubChannel);
});
it("should return an action object for linkDiscussionChannel", () => {
    const action = ActionCreator.linkDiscussionChannel(stubChannel) as ActionType.MetaChannelAction;

    expect(action.type).toBe(ActionType.LINK_DISCUSSION_CHANNEL);
    expect(action.channel).toBe(stubChannel);
});
it("should return an action object for startDayPhase", () => {
    const action = ActionCreator.startDayPhase();

    expect(action.type).toBe(ActionType.START_DAY_PHASE);
});
it("should return an action object for startNightPhase", () => {
    const action = ActionCreator.startNightPhase();

    expect(action.type).toBe(ActionType.START_NIGHT_PHASE);
});
