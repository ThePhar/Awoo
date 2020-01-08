import { TextChannel } from "discord.js";
import * as ActionType from "../interfaces/meta-actions";

export function linkNotificationChannel(channel: TextChannel): ActionType.MetaActions {
    return {
        type: ActionType.LINK_NOTIFICATION_CHANNEL,
        channel,
    };
}
export function linkDiscussionChannel(channel: TextChannel): ActionType.MetaActions {
    return {
        type: ActionType.LINK_DISCUSSION_CHANNEL,
        channel,
    };
}
export function startDayPhase(): ActionType.MetaActions {
    return {
        type: ActionType.START_DAY_PHASE,
    };
}
export function startNightPhase(): ActionType.MetaActions {
    return {
        type: ActionType.START_NIGHT_PHASE,
    };
}
