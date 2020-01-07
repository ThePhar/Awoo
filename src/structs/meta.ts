import { TextChannel } from "discord.js";
import Phases from "./phases";
import Elimination from "./elimination";

export default class Meta {
    notificationChannel: TextChannel | null = null;
    discussionChannel: TextChannel | null = null;
    phase = Phases.WaitingForPlayers;
    day = 0;
    awaitingElimination: Array<Elimination> = [];
}
