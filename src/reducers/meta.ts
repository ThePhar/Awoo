import Meta from "../structs/meta";
import {
    ADD_PLAYER_TO_ELIMINATION_QUEUE,
    CLEAR_ELIMINATION_QUEUE,
    LINK_DISCUSSION_CHANNEL,
    LINK_NOTIFICATION_CHANNEL,
    MetaActions,
    MetaChannelAction,
    MetaEliminationQueueAction,
    START_DAY_PHASE,
    START_NIGHT_PHASE,
} from "../interfaces/meta-actions";
import produce from "immer";
import Phases from "../structs/phases";

export default function metaReducer(state: Meta = new Meta(), action: MetaActions): Meta {
    return produce(state, draft => {
        switch (action.type) {
            case LINK_NOTIFICATION_CHANNEL:
                draft.notificationChannel = (action as MetaChannelAction).channel;
                break;

            case LINK_DISCUSSION_CHANNEL:
                draft.discussionChannel = (action as MetaChannelAction).channel;
                break;

            case START_DAY_PHASE:
                draft.phase = Phases.Day;
                break;

            case START_NIGHT_PHASE:
                draft.phase = Phases.Night;
                draft.day += 1;
                break;

            case ADD_PLAYER_TO_ELIMINATION_QUEUE:
                draft.awaitingElimination.push((action as MetaEliminationQueueAction).elimination);
                break;

            case CLEAR_ELIMINATION_QUEUE:
                draft.awaitingElimination = [];
                break;
        }
    });
}
