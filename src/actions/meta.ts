import {
    ADD_PLAYER_TO_ELIMINATION_QUEUE,
    CLEAR_ELIMINATION_QUEUE,
    LINK_DISCUSSION_CHANNEL,
    LINK_NOTIFICATION_CHANNEL,
    MetaActions,
    START_DAY_PHASE,
    START_NIGHT_PHASE,
} from "../interfaces/meta-actions";
import { TextChannel } from "discord.js";
import Elimination from "../structs/elimination";

export function linkNotificationChannel(channel: TextChannel): MetaActions {
    return {
        type: LINK_NOTIFICATION_CHANNEL,
        channel,
    };
}
export function linkDiscussionChannel(channel: TextChannel): MetaActions {
    return {
        type: LINK_DISCUSSION_CHANNEL,
        channel,
    };
}
export function startDayPhase(): MetaActions {
    return {
        type: START_DAY_PHASE,
    };
}
export function startNightPhase(): MetaActions {
    return {
        type: START_NIGHT_PHASE,
    };
}
export function addPlayerToEliminationQueue(elimination: Elimination): MetaActions {
    return {
        type: ADD_PLAYER_TO_ELIMINATION_QUEUE,
        elimination,
    };
}
export function clearEliminationQueue(): MetaActions {
    return {
        type: CLEAR_ELIMINATION_QUEUE,
    };
}
