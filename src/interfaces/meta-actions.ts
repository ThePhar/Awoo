import { TextChannel } from "discord.js";

export const LINK_NOTIFICATION_CHANNEL = "LINK_NOTIFICATION_CHANNEL";
export const LINK_DISCUSSION_CHANNEL = "LINK_DISCUSSION_CHANNEL";
export const START_DAY_PHASE = "START_DAY_PHASE";
export const START_NIGHT_PHASE = "START_NIGHT_PHASE";
export const START_GAME = "START_GAME";
export const END_GAME = "END_GAME";

export interface MetaSimpleAction {
    type: string;
}
export interface MetaChannelAction {
    type: string;
    channel: TextChannel;
}

export type MetaActions = MetaSimpleAction | MetaChannelAction;
