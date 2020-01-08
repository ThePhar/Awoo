import { GameStore } from "../store/game";
import { GameState } from "../test/old/store/game.test";
import { Message, RichEmbed } from "discord.js";
import RecognisedCommands from "./recognised-commands";
import Command from "./command";
import Colors from "./colors";
import { ADD_PLAYER, REMOVE_PLAYER } from "../interfaces/player-actions";
import moment from "moment";
import Phases from "./phases";
import { findAllAliveVillagers, findAllAliveWerewolves } from "../selectors/find-players";
import { startDayPhase, startNightPhase } from "../actions/meta";
import NightActiveRole from "../interfaces/night-active-role";
import { Job, scheduleJob } from "node-schedule";

export default class GameManager {
    game: GameStore;
    latestNotification?: Message | Array<Message>;
    schedule?: Job;

    constructor(game: GameStore) {
        this.game = game;

        this.startLobby();
        this.game.subscribe(this.checkWinConditions);
    }

    async startLobby(): Promise<void> {
        const state = this.game.getState() as GameState;

        // Check to ensure notification channel is defined.
        if (!state.meta.notificationChannel) {
            console.error("No notification channel specified, returning");
            return;
        }
        // Check to ensure discussion channel is defined.
        if (!state.meta.discussionChannel) {
            console.error("No discussion channel specified, returning");
            return;
        }

        // TODO: Write a separate file for this embed.
        const embed = new RichEmbed()
            .setTitle("New Werewolf Game - Waiting On Players")
            .setDescription(
                `Welcome to Awoo, an auto-moderated and real-time werewolf game for your Discord server, created by Zach Parks!\n\nIn order to begin a new game, we need a minimum of (6) players to join ${Command.getCode(
                    RecognisedCommands.Join,
                    [],
                )} in ${state.meta.discussionChannel}. For rules on how to play werewolf, type ${Command.getCode(
                    RecognisedCommands.Rules,
                    [],
                )} in ${state.meta.discussionChannel} or to me via DM.`,
            )
            .setColor(Colors.Informational)
            .addField("Signed Up Players", "**None**")
            .setFooter("TIP: PLACEHOLDER!");

        this.latestNotification = await state.meta.notificationChannel.send(embed);

        const stopLobby = this.game.subscribe(() => {
            const state = this.game.getState() as GameState;

            if (state.meta.lastActionFired.type === ADD_PLAYER || state.meta.lastActionFired.type === REMOVE_PLAYER) {
                const embed = new RichEmbed()
                    .setTitle("New Werewolf Game - Waiting On Players")
                    .setDescription(
                        `Welcome to Awoo, an auto-moderated and real-time werewolf game for your Discord server, created by Zach Parks!\n\nIn order to begin a new game, we need a minimum of (6) players to join ${Command.getCode(
                            RecognisedCommands.Join,
                            [],
                        )} in ${
                            state.meta.discussionChannel
                        }. For rules on how to play werewolf, type ${Command.getCode(
                            RecognisedCommands.Rules,
                            [],
                        )} in ${state.meta.discussionChannel} or to me via DM.`,
                    )
                    .setColor(Colors.Informational)
                    .addField("Signed Up Players", state.players.length > 0 ? state.players : "**None**")
                    .setFooter("TIP: PLACEHOLDER!");

                if (this.latestNotification) {
                    (this.latestNotification as Message).edit(embed);

                    // Check if minimum players have joined.
                    if (state.players.length >= 6) {
                        if (this.schedule) return;

                        const timeTilDusk = GameManager.getNextNightTime();
                        this.schedule = scheduleJob(timeTilDusk.toDate(), this.startFirstNight);
                    }
                }
            }
        });
    }
    async startFirstNight(): Promise<void> {
        // TODO: Handle role generation.
        this.game.dispatch(startNightPhase());

        const timeTilDawn = GameManager.getNextMorningTime();

        const state = this.game.getState() as GameState;
        // Send every player with a night action their night action embeds.
        state.players.forEach(player => {
            // @ts-ignore
            if ((player.role as NightActiveRole).nightAction && player.isAlive) {
                player.client.send((player.role as NightActiveRole).nightEmbed());
            }
        });

        // Set next phase schedule.
        this.schedule = scheduleJob(timeTilDawn.toDate(), this.startDay);

        // Send notification.
        if (state.meta.notificationChannel) {
            const embed = new RichEmbed()
                .setTitle(`Night ${state.meta.day}`)
                .setDescription(
                    `> “It's a seemingly peaceful night in the village of Pharville.”\n\n` +
                        `You have all been privately messaged your randomly assigned roles for this game along with any additional ` +
                        `information that may be relevant to you. If you have not received a message, ` +
                        `please ensure you have not blocked messages from this bot. You can get your role resent to you using ` +
                        `${Command.getCode(RecognisedCommands.Role, [])}.`,
                );

            state.meta.notificationChannel.send(embed);
        }
    }
    async startDay(): Promise<void> {
        this.game.dispatch(startDayPhase());

        const timeTilDusk = GameManager.getNextNightTime();

        const state = this.game.getState() as GameState;

        this.schedule = scheduleJob(timeTilDusk.toDate(), () => {
            // TODO: handle eliminations.

            this.startNight();
        });

        // Send notification.
        if (state.meta.notificationChannel) {
            const embed = new RichEmbed()
                .setTitle(`Night ${state.meta.day}`)
                .setDescription(
                    `> “The events of last night still linger in your minds. You must act quickly before it's too late.”\n\n` +
                        `You have all awoken and are free to discuss any events you have learned from last night. When you are ready to ` +
                        `accuse someone, use ${Command.getCode(RecognisedCommands.Accuse, [
                            "name/mention",
                        ])}. The player with the most accusations at the end of the day will be lynched and eliminated.\n\n` +
                        `Regardless of whether a player has been lynched today, the night will begin ${timeTilDusk}.`,
                );

            state.meta.notificationChannel.send(embed);
        }
    }
    async startNight(): Promise<void> {
        this.game.dispatch(startNightPhase());

        const timeTilDawn = GameManager.getNextMorningTime();

        const state = this.game.getState() as GameState;
        // Send every player with a night action their night action embeds.
        state.players.forEach(player => {
            // @ts-ignore
            if ((player.role as NightActiveRole).nightAction && player.isAlive) {
                player.client.send((player.role as NightActiveRole).nightEmbed());
            }
        });

        // Set next phase schedule.
        this.schedule = scheduleJob(timeTilDawn.toDate(), () => {
            // TODO: Handle eliminations.

            this.startDay();
        });

        // Send notification.
        if (state.meta.notificationChannel) {
            const embed = new RichEmbed()
                .setTitle(`Night ${state.meta.day}`)
                .setDescription(
                    `> “As the sun sets and darkness envelops the village, you all return to your residences for the night, ` +
                        `hoping to see the sun again.”\n\n` +
                        `During the night, you will be unable to speak in this channel, but if you have a night-active role, you will ` +
                        `receive a DM on what night actions are available. Be sure to perform your night actions before dawn or you ` +
                        `will forfeit any actions that may have given you an advantage.\n\n` +
                        `The sun will rise ${timeTilDawn}.`,
                );

            state.meta.notificationChannel.send(embed);
        }
    }

    checkWinConditions() {
        const stopWatching = this.game.subscribe(() => {
            const state = this.game.getState() as GameState;

            if (state.meta.phase !== Phases.WaitingForPlayers) {
                const livingWerewolfTotal = findAllAliveWerewolves(state.players).length;
                const livingVillagerTotal = findAllAliveVillagers(state.players).length;

                // Check villager victory
                if (livingWerewolfTotal === 0) {
                    stopWatching();

                    // TODO: Write embed for this.
                    if (state.meta.notificationChannel) {
                        state.meta.notificationChannel.send("Villagers win!");
                    }
                }
                // Check werewolf victory
                else if (livingWerewolfTotal >= livingVillagerTotal) {
                    stopWatching();

                    if (state.meta.notificationChannel) {
                        state.meta.notificationChannel.send("Werewolves win!");
                    }
                }
            }
        });
    }

    static getNextMorningTime(): moment.Moment {
        const morning = moment();

        // Set the hours, minutes, seconds, milliseconds to a specific time.
        // TODO: Remove hardcoded value.
        morning.hour(8);
        morning.minute(0);
        morning.second(0);
        morning.millisecond(0);

        // If we are already past the morning time for today, return tomorrow.
        if (moment().isAfter(morning)) {
            morning.add(1, "days");
        }

        return morning;
    }
    static getNextNightTime(): moment.Moment {
        const night = moment();

        // Set the hours, minutes, seconds, milliseconds to a specific time.
        // TODO: Remove hardcoded value.
        night.hour(20);
        night.minute(0);
        night.second(0);
        night.millisecond(0);

        // If we are already past the morning time for today, return tomorrow.
        if (moment().isAfter(night)) {
            night.add(1, "days");
        }

        return night;
    }
}
