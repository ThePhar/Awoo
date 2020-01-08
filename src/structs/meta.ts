import { TextChannel } from "discord.js";
import Phases from "./phases";
import { MetaActions } from "../interfaces/meta-actions";
import { PlayerActions } from "../interfaces/player-actions";

export default class Meta {
    notificationChannel: TextChannel | null = null;
    discussionChannel: TextChannel | null = null;
    phase = Phases.WaitingForPlayers;
    day = 0;
    lastActionFired: MetaActions | PlayerActions = { type: "AWOO_INIT" };
}
