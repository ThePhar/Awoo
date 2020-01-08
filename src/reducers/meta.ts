import produce from "immer";
import * as ActionType from "../interfaces/meta-actions";
import Meta from "../structs/meta";
import Phases from "../structs/phases";

export default function metaReducer(state: Meta = new Meta(), action: ActionType.MetaActions): Meta {
    return produce(state, draft => {
        switch (action.type) {
            /* Channel Actions */
            case ActionType.LINK_NOTIFICATION_CHANNEL:
                draft.notificationChannel = (action as ActionType.MetaChannelAction).channel;
                break;
            case ActionType.LINK_DISCUSSION_CHANNEL:
                draft.discussionChannel = (action as ActionType.MetaChannelAction).channel;
                break;

            /* Phase Actions */
            case ActionType.START_DAY_PHASE:
                draft.phase = Phases.Day;
                break;
            case ActionType.START_NIGHT_PHASE:
                draft.phase = Phases.Night;
                draft.day += 1;
                break;
        }

        // Save the last action for reference during game state changes.
        draft.lastActionFired = action;
    });
}
