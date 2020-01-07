import { TextChannel } from "discord.js";
import Elimination from "../structs/elimination";

export const LINK_NOTIFICATION_CHANNEL = "LINK_NOTIFICATION_CHANNEL";
export const LINK_DISCUSSION_CHANNEL = "LINK_DISCUSSION_CHANNEL";
export const START_DAY_PHASE = "START_DAY_PHASE";
export const START_NIGHT_PHASE = "START_NIGHT_PHASE";
export const ADD_PLAYER_TO_ELIMINATION_QUEUE = "ADD_PLAYER_TO_ELIMINATION_QUEUE";
export const CLEAR_ELIMINATION_QUEUE = "CLEAR_ELIMINATION_QUEUE";

export interface MetaSimpleActions {
    type: string;
}
export interface MetaChannelActions {
    type: string;
    channel: TextChannel;
}
export interface MetaEliminationQueueActions {
    type: string;
    elimination: Elimination;
}

export type MetaActions = MetaSimpleActions | MetaChannelActions | MetaEliminationQueueActions;
