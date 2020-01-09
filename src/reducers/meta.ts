import produce from "immer";
import * as ActionType from "../interfaces/meta-actions";
import Meta from "../structs/meta";
import Phases from "../structs/phases";

// TODO: add to separate file.
const DISABLE_MESSAGES = {
    SEND_MESSAGES: false,
};
const ENABLE_MESSAGES = {
    SEND_MESSAGES: true,
};
export const ROLE_ID = "662067288337416205";

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
            case ActionType.START_GAME:
                draft.phase = Phases.Day;
                if (draft.discussionChannel)
                    draft.discussionChannel.guild.roles.forEach(role => {
                        if (role.name === "@everyone" && draft.discussionChannel) {
                            draft.discussionChannel.overwritePermissions(role, DISABLE_MESSAGES);
                        } else if (role.id === ROLE_ID && draft.discussionChannel) {
                            draft.discussionChannel.overwritePermissions(role, ENABLE_MESSAGES);
                        }
                    });
                break;
            case ActionType.END_GAME:
                if (draft.discussionChannel)
                    draft.discussionChannel.guild.roles.forEach(role => {
                        if (role.name === "@everyone" && draft.discussionChannel) {
                            draft.discussionChannel.overwritePermissions(role, ENABLE_MESSAGES);
                        } else if (role.id === ROLE_ID && draft.discussionChannel) {
                            draft.discussionChannel.overwritePermissions(role, ENABLE_MESSAGES);
                        }
                    });
                break;

            case ActionType.START_DAY_PHASE:
                draft.phase = Phases.Day;
                if (draft.discussionChannel)
                    draft.discussionChannel.guild.roles.forEach(role => {
                        if (role.id === ROLE_ID && draft.discussionChannel) {
                            draft.discussionChannel.overwritePermissions(role, ENABLE_MESSAGES);
                        }
                    });
                break;
            case ActionType.START_NIGHT_PHASE:
                draft.phase = Phases.Night;
                draft.day += 1;
                if (draft.discussionChannel)
                    draft.discussionChannel.guild.roles.forEach(role => {
                        if (role.id === ROLE_ID && draft.discussionChannel) {
                            draft.discussionChannel.overwritePermissions(role, DISABLE_MESSAGES);
                        }
                    });
        }

        // Save the last action for reference during game state changes.
        draft.lastActionFired = action;
    });
}
