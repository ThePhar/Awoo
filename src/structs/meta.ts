import { TextChannel } from "discord.js";
import Phases from "./phases";

export default class Meta {
    channel: TextChannel | null = null;
    phase = Phases.WaitingForPlayers;
    day = 0;
    awaitingElimination = [];
}
