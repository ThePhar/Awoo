import * as Discord from "discord.js";

import { Role, SerializableRole } from "../roles/base";
import { Vote, SerializableVote } from "./vote";

import Villager from "../roles/villager";

export interface SerializablePlayer {
    readonly id: string;
    readonly alive: boolean;
    readonly role: SerializableRole;
    readonly vote: SerializableVote;
}

export class Player implements SerializablePlayer {
    public readonly member: Discord.GuildMember;

    public alive = true;
    public role: Role = new Villager();
    public vote: Vote = Vote.noVote(this);

    public constructor(member: Discord.GuildMember) {
        this.member = member;
    }

    /**
     * Get the id associated with this player.
     */
    public get id(): string {
        return this.member.id;
    }

    /**
     * Returns a player name in Discord's mention format.
     */
    public toString(): string {
        return this.member.toString();
    }
}
