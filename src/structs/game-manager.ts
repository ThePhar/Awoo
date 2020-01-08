import { GameState, GameStore } from "../store/game";
import { Message } from "discord.js";
import { ADD_PLAYER, REMOVE_PLAYER } from "../interfaces/player-actions";
import moment from "moment";
import { findAllAliveVillagers, findAllAliveWerewolves } from "../selectors/find-players";
import { startDayPhase, startNightPhase } from "../actions/meta";
import NightActiveRole from "../interfaces/night-active-role";
import { Job, scheduleJob } from "node-schedule";
import {
    dayEmbed,
    firstNightEmbed,
    lobbyEmbed,
    nightEmbed,
    villagerVictoryEmbed,
    werewolfVictoryEmbed,
} from "../strings/phase-embeds";
import { clearAllAccusations } from "../actions/players";
import Player from "./player";
import shuffle from "../util/shuffle";
import Seer from "../roles/seer";
import Werewolf from "../roles/werewolf";

export default class GameManager {
    game: GameStore;
    latestNotification?: Message | Array<Message>;
    schedule?: Job;

    constructor(game: GameStore) {
        this.game = game;

        this.startLobby();
    }

    async startLobby(): Promise<void> {
        const state = this.game.getState() as GameState;

        // Check to ensure notification channel is defined.
        if (!state.meta.notificationChannel) {
            // console.error("No notification channel specified, returning");
            throw new Error("No notification channel specified");
        }
        // Check to ensure discussion channel is defined.
        if (!state.meta.discussionChannel) {
            // console.error("No discussion channel specified, returning");
            throw new Error("No discussion channel specified");
        }

        // Keep track of the latest notification so we can update it on the fly!
        this.latestNotification = await state.meta.notificationChannel.send(lobbyEmbed(state));

        // Now start watching for dispatched events.
        const stopLobby = this.game.subscribe(() => {
            const state = this.game.getState() as GameState;

            // Only listen for ADD_PLAYER or REMOVE_PLAYER.
            if (state.meta.lastActionFired.type === ADD_PLAYER || state.meta.lastActionFired.type === REMOVE_PLAYER) {
                // Check if the latestNotification still exists and update it accordingly.
                if (this.latestNotification) {
                    (this.latestNotification as Message).edit(lobbyEmbed(state));

                    // Check if minimum players have joined.
                    // TODO: Move this hardcoded 6 to a settings file.
                    if (state.players.length >= 6) {
                        // If we already scheduled the game to start, don't reschedule.
                        if (this.schedule) return;

                        // Schedule the next game.
                        const timeTilDusk = GameManager.getNextNightTime();
                        this.schedule = scheduleJob(timeTilDusk.toDate(), () => {
                            stopLobby();
                            this.startFirstNight();
                        });
                    }
                }
            }
        });
    }
    async startFirstNight(): Promise<void> {
        const state = this.game.getState() as GameState;
        // Generate everyone's roles.
        GameManager.assignRandomRoles(state.players);

        // Send every player their role.
        state.players.forEach(player => {
            player.user.send(player.role.embed());
        });

        // Start the night phase.
        this.game.dispatch(startNightPhase());

        // Start watching for win conditions.
        this.game.subscribe(this.checkWinConditions);

        // Send every player with a night action their night action embeds.
        state.players.forEach(player => {
            if ((player.role as NightActiveRole).nightAction && player.isAlive) {
                player.user.send((player.role as NightActiveRole).nightEmbed());
            }
        });

        // Set next phase schedule.
        const timeTilDawn = GameManager.getNextMorningTime();
        this.schedule = scheduleJob(timeTilDawn.toDate(), this.startDay);

        // Send notification.
        if (state.meta.notificationChannel) {
            state.meta.notificationChannel.send(firstNightEmbed(state));
        }
    }
    async startDay(): Promise<void> {
        const state = this.game.getState() as GameState;
        // Check for eliminations.
        // TODO

        // Start the day phase.
        this.game.dispatch(startDayPhase());
        this.game.dispatch(clearAllAccusations());

        // Set next phase schedule.
        const timeTilDusk = GameManager.getNextNightTime();
        this.schedule = scheduleJob(timeTilDusk.toDate(), this.startNight);

        // Send notification.
        if (state.meta.notificationChannel) {
            state.meta.notificationChannel.send(dayEmbed(state));
        }
    }
    async startNight(): Promise<void> {
        const state = this.game.getState() as GameState;

        // Check for eliminations.
        // TODO

        // Start the night phase.
        this.game.dispatch(startNightPhase());

        // Send every player with a night action their night action embeds.
        state.players.forEach(player => {
            if ((player.role as NightActiveRole).nightAction && player.isAlive) {
                player.user.send((player.role as NightActiveRole).nightEmbed());
            }
        });

        // Set next phase schedule.
        const timeTilDawn = GameManager.getNextMorningTime();
        this.schedule = scheduleJob(timeTilDawn.toDate(), this.startDay);

        // Send notification.
        if (state.meta.notificationChannel) {
            state.meta.notificationChannel.send(nightEmbed(state));
        }
    }

    // TODO: Separate file???
    checkWinConditions(): void {
        const stopWatching = this.game.subscribe(() => {
            const state = this.game.getState() as GameState;

            const livingWerewolfTotal = findAllAliveWerewolves(state.players).length;
            const livingVillagerTotal = findAllAliveVillagers(state.players).length;

            // Check villager victory
            if (livingWerewolfTotal === 0) {
                stopWatching();

                if (state.meta.notificationChannel) {
                    state.meta.notificationChannel.send(villagerVictoryEmbed(state));
                }
            }
            // Check werewolf victory
            else if (livingWerewolfTotal >= livingVillagerTotal) {
                stopWatching();

                if (state.meta.notificationChannel) {
                    state.meta.notificationChannel.send(werewolfVictoryEmbed(state));
                }
            }
        });
    }

    // TODO: Separate file???
    static assignRandomRoles(players: Array<Player>, type: GameModes = GameModes.Normal): void {
        const shuffledPlayers = shuffle(players);

        switch (type) {
            case GameModes.Normal:
                shuffledPlayers[0].role = new Seer(shuffledPlayers[0]);
                shuffledPlayers[1].role = new Werewolf(shuffledPlayers[1]);

                // 9 to 11 Players
                if (players.length >= 9 && players.length <= 11) {
                    shuffledPlayers[2].role = new Werewolf(shuffledPlayers[2]);
                }
                // 12+ Players
                else if (players.length >= 12) {
                    shuffledPlayers[3].role = new Werewolf(shuffledPlayers[3]);
                }
        }
    }

    static getNextMorningTime(custom?: moment.Moment): moment.Moment {
        if (custom) return custom;

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
    static getNextNightTime(custom?: moment.Moment): moment.Moment {
        if (custom) return custom;

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
