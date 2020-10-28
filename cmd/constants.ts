import { BitFieldResolvable, PermissionString } from "discord.js";
import { CommandInfo } from "discord.js-commando";

const CLIENT_PERMISSIONS: BitFieldResolvable<PermissionString>[] = [
  "EMBED_LINKS",
  "MANAGE_CHANNELS",
  "MANAGE_MESSAGES",
  "READ_MESSAGE_HISTORY",
  "SEND_MESSAGES",
  "USE_EXTERNAL_EMOJIS",
  "VIEW_CHANNEL"
];

export const adminCommandBaseSettings: Partial<CommandInfo> = {
  guildOnly: true,
  userPermissions: ["ADMINISTRATOR"],
  throttling: {
    usages: 1,
    duration: 10
  },
  clientPermissions: CLIENT_PERMISSIONS
};

export const userCommandBaseSettings: Partial<CommandInfo> = {
  guildOnly: true,
  throttling: {
    usages: 1,
    duration: 10
  },
  clientPermissions: CLIENT_PERMISSIONS
};
