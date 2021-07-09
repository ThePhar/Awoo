import * as Discord from "discord.js";

import { Phase } from "../constants/phase";
import { Player, SerializablePlayer } from "./player";
import { getNextNight } from "../util/date";

import Schedule from "node-schedule";

export interface SerializableGame {
    readonly id: string;
    readonly day: number;
    readonly phase: Phase;
    readonly active: boolean;
    readonly players: SerializablePlayer[];
}

export class Game implements SerializableGame {
    public readonly channel: Discord.TextChannel;
    public readonly defaultPermissions: Discord.Collection<`${bigint}`, Discord.PermissionOverwrites>;
    public readonly playerMap: Map<string, Player> = new Map();
    public readonly embeds: Map<string, Discord.Message | undefined> = new Map([
        ["start", undefined],
        ["latest", undefined],
    ]);

    public day = 0;
    public phase = Phase.Day;
    public active = false;

    public schedule?: Schedule.Job;
    public reminder?: Schedule.Job;

    public constructor(channel: Discord.TextChannel) {
        this.channel = channel;
        this.defaultPermissions = channel.permissionOverwrites.valueOf();
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

    public async startNewGame(): Promise<void> {
        this.active = true;

        // TODO: Randomize roles.

        // Mute all non-players.
        const permissions: Discord.OverwriteData[] = [
            {
                id: this.channel.guild.roles.everyone,
                deny: "SEND_MESSAGES",
                type: "role",
            },
        ];

        const failedToSend: Player[] = [];

        // Add all players to this overwrite list.
        for (const player of this.players) {
            permissions.push({
                id: player.member.id,
                allow: "SEND_MESSAGES",
                type: "member",
            });

            try {
                await player.member.send({ embeds: [player.role.personalEmbed(this)] });
            } catch {
                failedToSend.push(player);
            }
        }

        await this.channel.permissionOverwrites.set(permissions);

        if (failedToSend.length > 0) {
            await this.channel.send(
                `I was unable to send your roles via DM, ${failedToSend
                    .map((p) => `${p}`)
                    .join(", ")}. To see your role, type \`/myrole\``,
            );
        }

        // TODO: Start Night Phase 1
    }

    /**
     * Schedule the start of the game for the next night.
     */
    public scheduleGameStart(): void {
        this.schedule = Schedule.scheduleJob(getNextNight(), this.startNewGame.bind(this));
    }

    /**
     * Cancel the next scheduled game and mark it undefined.
     */
    public clearSchedules(): void {
        if (this.schedule) {
            this.schedule.cancelNext();
            this.schedule = undefined;
        }
        if (this.reminder) {
            this.reminder.cancelNext();
            this.reminder = undefined;
        }
    }
}
