import * as Discord from "discord.js";
import * as Embeds  from "../templates/embed-templates";

import GameState   from "../interfaces/game-state";
import PlayerState from "../interfaces/player-state";
import Phase       from "./phase";
import Player      from "./player";
import ElimEmbeds  from "../templates/elimination-templates";

import Werewolf from "../roles/werewolf";
import Seer     from "../roles/seer";

export default class Game {
    private readonly _notificationChannel: Discord.TextChannel;

    private readonly _players         = new Map<string, Player>();
    private readonly _active: boolean = false;
    private          _phase:  Phase   = Phase.Waiting;
    private          _day             = 0;

    constructor(channel: Discord.TextChannel, state?: GameState) {
        this._notificationChannel = channel;

        // Predetermined values.
        if (state) {
            this._active = state.active;
            this._phase = state.phase;
            this._day = state.day;
        }
    }

    /* Discord Functions */
    send(content: unknown): void {
        this._notificationChannel.send(content);
    }

    /* Game Functions */
    initializeGame(): void {
        // Send everyone their roles.
        this._players.forEach((player) => {
            player.role.sendRole();
        });

        this.startNightPhase();
    }
    /**
     * Changes the state to start the day phase.
     */
    startDayPhase(): void {
        this._phase = Phase.Day;

        // Eliminate the werewolf target.
        if (this._day !== 1) {
            this.processWerewolfElimination();
        }

        // Process inspections.
        this.players.all.forEach((player) => {
            this.processSeerInspection(player);
        });

        this.send(Embeds.dayEmbed(this));
    }

    /**
     * Changes the state to start the night phase.
     */
    startNightPhase(): void {
        this._day += 1;
        this._phase = Phase.Night;

        // Eliminate the player with the most votes.
        if (this._day !== 1) {
            this.processLynchElimination();
        }

        // Clear all accusations and send night action reminders.
        this._players.forEach((player) => {
            player.accusing = null;

            if (player.alive) {
                player.role.sendActionReminder();
            }
        });

        this.send(Embeds.nightEmbed(this));
    }

    /* Players Functions */
    /**
     * Create a player and add it to the game's players map. If a player already exists, does nothing and returns.
     * @param member The guild member object from Discord.
     * @param state An optional player state to initialize this player with.
     * @return The newly instantiated player object if not already exists. Otherwise, undefined.
     */
    addPlayer(member: Discord.GuildMember, state?: PlayerState): Player | undefined {
        if (this._players.get(member.id)) {
            return;
        }

        const player = new Player(member, this, state);

        this._players.set(player.id, player);
        return player;
    }
    /**
     * Get the player from the game's players map if exists. If no player exists, returns undefined.
     * @param id The id of the player to find. Should match the id of the Discord user.
     * @return The existing player object if already exists. Otherwise, undefined.
     */
    getPlayer(id: string): Player | undefined {
        return this._players.get(id);
    }
    getPlayerByTag(tag: string): Player | Player[] | undefined {
        const playerArray: Player[] = [];

        if (tag === "") {
            return undefined;
        }

        this._players.forEach((player) => {
            if (player.tag.toLowerCase().includes(tag.toLowerCase())) {
                playerArray.push(player);
            }
        });

        if (playerArray.length === 1) {
            return playerArray[0];
        } else if (playerArray.length === 0) {
            return undefined;
        } else {
            return playerArray;
        }
    }
    /**
     * Remove and return the player from the game's players map if exists. If no player exists, returns undefined.
     * @param id The id of the player to find. Should match the id of the Discord user.
     * @return The removed player object if already exists. Otherwise, undefined.
     */
    removePlayer(id: string): Player | undefined {
        const player = this._players.get(id);

        if (player) {
            this._players.delete(id);
            return player;
        }
    }

    // Role processes.
    private processLynchElimination(): void {
        // Go through each player and tally up the votes.
        const votes = new Map<Player, number>();
        for (const [, player] of this._players) {
            if (player.accusing) {
                const value = votes.get(player.accusing);
                if (value) {
                    votes.set(player.accusing, value + 1);
                } else {
                    votes.set(player.accusing, 1);
                }
            }
        }

        // Convert map to array and sort by number of votes.
        const sorted = [...votes.entries()].sort((a, b) => b[1] - a[1]);

        if (sorted.length === 1) {
            sorted[0][0].alive = false;
            this.send(ElimEmbeds.lynch(sorted[0][0], sorted, this));
            return;
        }
        else if (sorted.length > 1) {
            if (sorted[0][1] > sorted[1][1]) {
                sorted[0][0].alive = false;
                this.send(ElimEmbeds.lynch(sorted[0][0], sorted, this));
                return;
            }
        }

        this.send(ElimEmbeds.noLynch(sorted, this));
    }
    private processWerewolfElimination(): void {
        // Go through each player and tally up the votes.
        const votes = new Map<Player, number>();
        for (const player of this.players.aliveWerewolves) {
            const role = player.role as Werewolf;
            if (role.target) {
                const value = votes.get(role.target);
                if (value) {
                    votes.set(role.target, value + 1);
                } else {
                    votes.set(role.target, 1);
                }
            }
        }

        // Convert map to array and sort by number of votes.
        const sorted = [...votes.entries()].sort((a, b) => b[1] - a[1]);

        if (sorted.length === 1) {
            sorted[0][0].alive = false;
            this.send(ElimEmbeds.werewolf(sorted[0][0]));
            return;
        }
        else if (sorted.length > 1) {
            if (sorted[0][1] > sorted[1][1]) {
                sorted[0][0].alive = false;
                this.send(ElimEmbeds.werewolf(sorted[0][0]));
                return;
            }
        }

        this.send(ElimEmbeds.noNightElim());
    }
    private processSeerInspection(player: Player): void {
        if (player.role instanceof Seer && player.role.target) {
            if (player.alive) {
                player.send(
                    `You have learned that ${player.role.target} is a ${player.role.target.role.appearance}.`
                );
                player.role.inspected.set(player.role.target.id, player.role.target);
                player.role.target = undefined;
            } else {
                player.send(
                    `You have met an unfortunate end before you could learn about ${player.role.target}. May you rest peacefully in the next life.`
                );
                player.role.target = undefined;
            }
        }
    }

    get id():           string {
        return this._notificationChannel.guild.id;
    }
    get guild():        Discord.Guild {
        return this._notificationChannel.guild;
    }
    get totalPlayers(): number {
        return this._players.size;
    }
    get players():      Players {
        const all:             Player[] = [];
        const alive:           Player[] = [];
        const dead:            Player[] = [];
        const aliveWerewolves: Player[] = [];
        const aliveVillagers:  Player[] = [];

        this._players.forEach((player) => {
            all.push(player);

            if (player.alive) {
                alive.push(player);

                if (player.role instanceof Werewolf) {
                    aliveWerewolves.push(player);
                } else {
                    aliveVillagers.push(player);
                }
            } else {
                dead.push(player);
            }
        });

        return {
            all,
            dead,
            alive,
            aliveVillagers,
            aliveWerewolves
        };
    }
    get active():       boolean {
        return this._active;
    }
    get phase():        Phase {
        return this._phase;
    }
    get day():          number {
        return this._day;
    }
}

type Players = {
    all: Player[];
    alive: Player[];
    dead: Player[];
    aliveWerewolves: Player[];
    aliveVillagers: Player[];
}
