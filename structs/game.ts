import * as Discord from "discord.js";

import { Phase } from "../constants/phase";
import { Player, SerializablePlayer } from "./player";

export interface SerializableGame {
    readonly id: string;
    readonly day: number;
    readonly phase: Phase;
    readonly active: boolean;
    readonly players: SerializablePlayer[];
}

export class Game implements SerializableGame {
    public readonly channel: Discord.TextChannel;
    public readonly playerMap: Map<string, Player> = new Map();
    public readonly day = 1;
    public readonly phase = Phase.Night;
    public readonly active = false;

    public constructor(channel: Discord.TextChannel) {
        this.channel = channel;
    }

    /**
     * Returns the id of this game.
     */
    public get id(): string {
        return this.channel.id;
    }

    /**
     * Returns an array version of all players in this game.
     */
    public get players(): Player[] {
        const players: Player[] = [];
        for (const player of this.playerMap.values()) {
            players.push(player);
        }

        return players;
    }
}
