import { TextChannel } from "discord.js";
import Phases from "./phases";
import Elimination from "./elimination";
import { MetaActions } from "../interfaces/meta-actions";
import { PlayersActions } from "../interfaces/players-actions";

export default class Meta {
    notificationChannel: TextChannel | null = null;
    discussionChannel: TextChannel | null = null;
    phase = Phases.WaitingForPlayers;
    day = 0;
    awaitingElimination: Array<Elimination> = [];
    lastActionFired: MetaActions | PlayersActions = { type: "AWOO_INIT" };
}
