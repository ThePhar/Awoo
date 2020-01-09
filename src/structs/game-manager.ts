import { GameState, GameStore } from "../store/game";
import { Game, Message, RichEmbed } from "discord.js";
import { ADD_PLAYER, REMOVE_PLAYER } from "../interfaces/player-actions";
import moment from "moment";
import { findAllAlivePlayers, findAllAliveVillagers, findAllAliveWerewolves } from "../selectors/find-players";
import { endGame, startDayPhase, startGame, startNightPhase } from "../actions/meta";
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
import { clearAllAccusations, eliminatePlayer } from "../actions/players";
import Player from "./player";
import shuffle from "../util/shuffle";
import Seer from "../roles/seer";
import Werewolf from "../roles/werewolf";
import Elimination from "./elimination";
import EliminationCause from "./elimination-cause";
import Colors from "./colors";
import randomItem from "random-item";
import Tips from "../strings/tips";
import getMostDuplicates from "../util/duplicate";
import GameModes from "./game-modes";

export default class GameManager {
    game: GameStore;
    latestNotification?: Message | Array<Message>;
    latestDiscussion?: Message | Array<Message>;
    schedule?: Job;

    constructor(game: GameStore) {
        this.game = game;

        GameManager.startLobby(this);
    }

    static async startLobby(gm: GameManager): Promise<void> {
        const state = gm.game.getState() as GameState;

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
        gm.latestNotification = await state.meta.notificationChannel.send(lobbyEmbed(state));
        gm.latestDiscussion = await state.meta.discussionChannel.send(lobbyEmbed(state));

        // Now start watching for dispatched events.
        const stopLobby = gm.game.subscribe(() => {
            const state = gm.game.getState() as GameState;

            // Only listen for ADD_PLAYER or REMOVE_PLAYER.
            if (state.meta.lastActionFired.type === ADD_PLAYER || state.meta.lastActionFired.type === REMOVE_PLAYER) {
                // Check if the latestNotification still exists and update it accordingly.
                if (gm.latestNotification && gm.latestDiscussion) {
                    (gm.latestNotification as Message).edit(lobbyEmbed(state));
                    (gm.latestDiscussion as Message).edit(lobbyEmbed(state));

                    // Check if minimum players have joined.
                    // TODO: Move this hardcoded 6 to a settings file.
                    if (state.players.length >= 4) {
                        // If we already scheduled the game to start, don't reschedule.
                        if (gm.schedule) return;

                        // Schedule the next game.
                        const timeTilDusk = GameManager.getNextNightTime(moment().add("5", "seconds"));
                        gm.schedule = scheduleJob(timeTilDusk.toDate(), () => {
                            stopLobby();
                            GameManager.startFirstNight(gm);
                        });
                    } else if (state.players.length < 4) {
                        if (gm.schedule) {
                            gm.schedule.cancel();
                            gm.schedule = undefined;
                        }
                    }
                }
            }
        });
    }
    static async startFirstNight(gm: GameManager): Promise<void> {
        const state = gm.game.getState() as GameState;
        // Generate everyone's roles.
        GameManager.assignRandomRoles(state.players);

        // Send every player their role.
        state.players.forEach(player => {
            player.user.send(player.role.embed());
        });

        // Start the night phase.
        gm.game.dispatch(startGame());
        gm.game.dispatch(startNightPhase());

        // Start watching for win conditions.
        gm.game.subscribe(() => GameManager.checkWinConditions(gm));

        // Send every player with a night action their night action embeds.
        state.players.forEach(player => {
            if ((player.role as NightActiveRole).nightAction && player.isAlive) {
                player.user.send((player.role as NightActiveRole).nightEmbed());
            }
        });

        // Set next phase schedule.
        const timeTilDawn = GameManager.getNextMorningTime(moment().add("1", "seconds"));
        gm.schedule = scheduleJob(timeTilDawn.toDate(), () => GameManager.startDay(gm));

        // Send notification.
        if (state.meta.notificationChannel) {
            state.meta.notificationChannel.send(firstNightEmbed(state));
        }
        if (state.meta.discussionChannel) {
            state.meta.discussionChannel.send(firstNightEmbed(state));
        }
    }
    static async startDay(gm: GameManager): Promise<void> {
        const state = gm.game.getState() as GameState;
        // Check for eliminations.
        const eliminations = [];

        const werewolfElimination = Werewolf.getElimination(state);
        if (werewolfElimination) eliminations.push(werewolfElimination);

        // Process eliminations.
        GameManager.processEliminations(eliminations, gm);

        // Start the day phase.
        gm.game.dispatch(startDayPhase());
        gm.game.dispatch(clearAllAccusations());

        // Set next phase schedule.
        const timeTilDusk = GameManager.getNextNightTime(moment().add("1", "minutes"));
        gm.schedule = scheduleJob(timeTilDusk.toDate(), () => {
            GameManager.startNight(gm);
        });

        // Send notification.
        if (state.meta.notificationChannel) {
            state.meta.notificationChannel.send(dayEmbed(state));
        }
        if (state.meta.discussionChannel) {
            state.meta.discussionChannel.send(dayEmbed(state));
        }
    }
    static async startNight(gm: GameManager): Promise<void> {
        const state = gm.game.getState() as GameState;
        // Check for eliminations.
        const eliminations = [];

        const lynchElimination = GameManager.getLynchElimination(state);
        if (lynchElimination) eliminations.push(lynchElimination);

        // Process eliminations.
        GameManager.processEliminations(eliminations, gm);

        // Start the night phase.
        gm.game.dispatch(startNightPhase());

        // Send every player with a night action their night action embeds.
        state.players.forEach(player => {
            if ((player.role as NightActiveRole).nightAction && player.isAlive) {
                player.user.send((player.role as NightActiveRole).nightEmbed());
            }
        });

        // Set next phase schedule.
        const timeTilDawn = GameManager.getNextMorningTime(moment().add("1", "minutes"));
        gm.schedule = scheduleJob(timeTilDawn.toDate(), () => {
            GameManager.startDay(gm);
        });

        // Send notification.
        if (state.meta.notificationChannel) {
            state.meta.notificationChannel.send(nightEmbed(state));
        }
        if (state.meta.discussionChannel) {
            state.meta.discussionChannel.send(nightEmbed(state));
        }
    }

    // TODO: Separate file???
    private static checkWinConditions(gm: GameManager): void {
        const stopWatching = gm.game.subscribe(() => {
            const state = gm.game.getState() as GameState;

            const livingWerewolfTotal = findAllAliveWerewolves(state.players).length;
            const livingVillagerTotal = findAllAliveVillagers(state.players).length;

            // Check villager victory
            if (livingWerewolfTotal === 0) {
                stopWatching();
                gm.game.dispatch(endGame());

                if (state.meta.notificationChannel) {
                    state.meta.notificationChannel.send(villagerVictoryEmbed(state));
                }
                if (state.meta.discussionChannel) {
                    state.meta.discussionChannel.send(villagerVictoryEmbed(state));
                }
            }
            // Check werewolf victory
            else if (livingWerewolfTotal >= livingVillagerTotal) {
                stopWatching();
                gm.game.dispatch(endGame());

                if (state.meta.notificationChannel) {
                    state.meta.notificationChannel.send(werewolfVictoryEmbed(state));
                }
                if (state.meta.discussionChannel) {
                    state.meta.discussionChannel.send(werewolfVictoryEmbed(state));
                }
            }
        });
    }

    // TODO: Separate file???
    private static assignRandomRoles(players: Array<Player>, type: GameModes = GameModes.Normal): void {
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

    private static getNextMorningTime(custom?: moment.Moment): moment.Moment {
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
    private static getNextNightTime(custom?: moment.Moment): moment.Moment {
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
    private static getLynchElimination(state: GameState): Elimination | undefined {
        const targets = findAllAlivePlayers(state.players)
            .filter(player => player.accusing)
            .map(player => player.accusing as Player);

        const mostTargeted = getMostDuplicates(targets);
        if (mostTargeted.length !== 1) {
            return undefined;
        }

        const eliminate = mostTargeted[0];

        if (eliminate) {
            return new Elimination(eliminate, GameManager.eliminationLynchEmbed(eliminate), EliminationCause.Lynching);
        }
    }
    private static eliminationLynchEmbed(player: Player): RichEmbed {
        return (
            new RichEmbed()
                .setTitle(`${player.user} Has Been Lynched`)
                .setDescription(
                    `> “Despite their pleas, the village has decided to lynch ${player.user}. They force him into the gallows, and with a swift pull of the lever, they are gone.”\n\n${player.user} has been lynched and eliminated from the game.`,
                )
                .setColor(Colors.WerewolfRed)
                // TODO: Create thumbnail. Maybe an image?
                .setFooter(randomItem(Tips))
        );
    }

    private static processEliminations(eliminations: Array<Elimination>, gm: GameManager): void {
        const state = gm.game.getState() as GameState;

        if (eliminations.length !== 0) {
            eliminations.forEach(elimination => {
                if (state.meta.notificationChannel) {
                    state.meta.notificationChannel.send(elimination.embed);
                }
                gm.game.dispatch(eliminatePlayer(elimination.player));
            });
        }
    }
}
