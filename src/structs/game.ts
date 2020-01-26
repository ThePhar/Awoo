import * as Discord from "discord.js";
import * as Embeds  from "../templates/embed-templates";
import * as Time    from "../util/date";

import GameState   from "../interfaces/game-state";
import PlayerState from "../interfaces/player-state";
import Phase       from "./phase";
import Player      from "./player";
import ElimEmbeds  from "../templates/elimination-templates";
import Schedule    from "node-schedule";
import shuffle     from "../util/shuffle";
import dedent from "dedent";

import Werewolf from "../roles/werewolf";
import Seer     from "../roles/seer";
import { getNextNight } from "../util/date";
import Bodyguard from "../roles/bodyguard";
import Hunter from "../roles/hunter";
import Lycan from "../roles/lycan";
import Mayor from "../roles/mayor";
import Tanner from "../roles/tanner";
import Sorceress from "../roles/sorceress";
import Witch from "../roles/witch";
import Insomniac from "../roles/insomniac";
import Minion from "../roles/minion";
import Mason from "../roles/mason";
import Villager from "../roles/villager";
import Drunk from "../roles/drunk";
import * as AwooConsole from "../util/logging";

export default class Game {
    private readonly _notificationChannel: Discord.TextChannel;
    private          _schedule?:           Schedule.Job;
    private          _reminder?:           Schedule.Job;

    private readonly _players         = new Map<string, Player>();
    private          _active          = false;
    private          _phase:  Phase   = Phase.Waiting;

    day = 0;

    lobbyMessage?: Discord.Message;

    constructor(channel: Discord.TextChannel, state?: GameState) {
        this._notificationChannel = channel;

        // Predetermined values.
        if (state) {
            AwooConsole.log(dedent(`
                Generating a new game with predefined state.
                    Guild:   ${this._notificationChannel.guild.id}: ${this._notificationChannel.guild.name}
                    Channel: ${this._notificationChannel.id}: ${this._notificationChannel.name}
                    Active:  ${state.active}
                    Phase:   ${state.phase}
                    Day:     ${state.day}
            `));

            this._active = state.active;
            this._phase = state.phase;
            this.day = state.day;
        } else {
            AwooConsole.log(dedent(`
                Generating a new game with default state.
                    Guild:   ${this._notificationChannel.guild.id}: ${this._notificationChannel.guild.name}
                    Channel: ${this._notificationChannel.id}: ${this._notificationChannel.name}
                    Active:  ${this._active}
                    Phase:   ${this._phase}
                    Day:     ${this.day}
            `));
        }
    }

    /* Discord Functions */
    async send(content: unknown): Promise<boolean> {
        try {
            await this._notificationChannel.send(content);

            if (content instanceof Discord.RichEmbed) {
                AwooConsole.log(dedent(`
                    Sent an embed to guild channel.
                        Guild:       ${this._notificationChannel.guild.id}: ${this._notificationChannel.guild.name}
                        Channel:     ${this._notificationChannel.id}: ${this._notificationChannel.name}
                        Title:       ${content.title}
                        Description: ${content.description}
                        Color:       ${content.color     ? content.color.toString(16) : "undefined"}
                        Thumbnail:   ${content.thumbnail ? content.thumbnail.url           : "undefined"}
                        Image:       ${content.image     ? content.image.url               : "undefined"}
                        Footer:      ${content.footer    ? content.footer.text             : "undefined"}
                `));
            } else {
                AwooConsole.log(dedent(`
                    Sent a message to guild channel.
                        Guild:   ${this._notificationChannel.guild.id}: ${this._notificationChannel.guild.name}
                        Channel: ${this._notificationChannel.id}: ${this._notificationChannel.name}
                        Message: ${content}
                `));
            }

            return true;
        } catch (error) {
            if (content instanceof Discord.RichEmbed) {
                AwooConsole.error(dedent(`
                    Error sending an embed to guild channel.
                        Guild:       ${this._notificationChannel.guild.id}: ${this._notificationChannel.guild.name}
                        Channel:     ${this._notificationChannel.id}: ${this._notificationChannel.name}
                        Error:       ${error}
                        Title:       ${content.title}
                        Description: ${content.description}
                        Color:       ${content.color     ? content.color.toString(16) : "undefined"}
                        Thumbnail:   ${content.thumbnail ? content.thumbnail.url           : "undefined"}
                        Image:       ${content.image     ? content.image.url               : "undefined"}
                        Footer:      ${content.footer    ? content.footer.text             : "undefined"}
                `));
            } else {
                AwooConsole.error(dedent(`
                    Error sending a message to guild channel.
                        Guild:   ${this._notificationChannel.guild.id}: ${this._notificationChannel.guild.name}
                        Channel: ${this._notificationChannel.id}: ${this._notificationChannel.name}
                        Error:   ${error}
                        Message: ${content}
                `));
            }

            return false;
        }
    }

    /* Game Functions */
    initializeGame(): void {
        this.assignRoles();

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
        if (this.day !== 1) {
            const elim1 = this.processWerewolfElimination();
            const elim2 = this.processWitchElimination();
            const elim3 = this.processHunterElimination();


            if (!elim1 && !elim2 && !elim3) {
                this.send(ElimEmbeds.noNightElim());
            }
        }

        // Check for win conditions.
        if (this.winCondition()) {
            if (this._schedule && this._reminder) {
                this._schedule.cancelNext();
                this._reminder.cancelNext();
                this._schedule = undefined;
                this._reminder = undefined;
            }
            return;
        }

        // Process inspections.
        this.players.all.forEach((player) => {
            this.processSeerInspection(player);
            this.processSorceressInspection(player);
            this.processInsomniacInspection(player);
        });

        const nextNight = Time.getNextNight();

        this.send(Embeds.dayEmbed(this, nextNight));
        this._schedule = Schedule.scheduleJob(nextNight.toDate(), () => this.startNightPhase());
        this._reminder = Schedule.scheduleJob(nextNight.subtract("1", "hours").toDate(), () => {
            const playersWithNoLynch = this.players.alive.filter((p) => !p.accuse).map((p) => p.toString()).join(" ");

            if (playersWithNoLynch.length > 0) {
                this.send(
                    new Discord.RichEmbed()
                        .setDescription(`The day will end in 1 hour.\n\nJust a reminder to: ${playersWithNoLynch}, you have not voted to lynch any players.`)
                );
            } else {
                this.send(
                    new Discord.RichEmbed()
                        .setDescription(`The day will end in 1 hour.`)
                );
            }
        });
    }

    /**
     * Changes the state to start the night phase.
     */
    startNightPhase(): void {
        this.day += 1;
        this._phase = Phase.Night;

        // Eliminate the player with the most votes.
        this.processLynchElimination();
        this.processHunterElimination();

        // Check for win conditions.
        if (this.winCondition()) {
            if (this._schedule && this._reminder) {
                this._schedule.cancelNext();
                this._reminder.cancelNext();
                this._schedule = undefined;
                this._reminder = undefined;
            }
            return;
        }

        // Clear all accusations and send night action reminders.
        this._players.forEach((player) => {
            player.accusing = null;

            if (player.alive) {
                player.role.sendActionReminder();
            }
        });

        const nextDay = Time.getNextMorning();

        this.send(Embeds.nightEmbed(this, nextDay));
        this._schedule = Schedule.scheduleJob(nextDay.toDate(), () => this.startDayPhase());
        this._reminder = Schedule.scheduleJob(nextDay.subtract("1", "hours").toDate(), () => {
            this.send(
                new Discord.RichEmbed()
                    .setDescription(`The night will end in 1 hour. If you have a night active role, be sure to use it in the DMs!`)
            );
        });
    }

    /* Players Functions */
    /**
     * Create a player and add it to the game's players map. If a player already exists, does nothing and returns.
     * @param member The guild member object from Discord.
     * @param state An optional player state to initialize this player with.
     * @return The newly instantiated player object if not already exists. Otherwise, undefined.
     */
    addPlayer(member: Discord.GuildMember, state?: PlayerState): Player {
        // If our player already exists, return the player we were trying to add.
        let player = this._players.get(member.id);
        if (player) return player;

        player = new Player(member, this, state);
        this._players.set(player.id, player);

        if (this._players.size >= 6 && this._schedule === undefined) {
            this._schedule = Schedule.scheduleJob(getNextNight().toDate(), () => this.initializeGame());
            this.send("We have enough players to begin the next game. Scheduling to start next night.");
        }

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

            if (this._players.size < 6 && this._schedule) {
                this._schedule.cancelNext();
                this._schedule = undefined;
                this.send("Oh no! Now we don't have enough players. Canceling start until more players join.");
            }

            return player;
        }
    }

    assignRoles(): void {
        const shuffled = shuffle(this.players.all);

        shuffled[0].role = new Seer(shuffled[0]);
        shuffled[1].role = new Werewolf(shuffled[1]);

        // Chance for roles?
        if (shuffled.length >= 7) {
            if (Math.random() < 0.1) shuffled[2].role = new Tanner(shuffled[2]);
            if (Math.random() < 0.25) shuffled[3].role = new Mayor(shuffled[3]);
            if (Math.random() < 0.25) shuffled[5].role = new Lycan(shuffled[5]);
        }
        if (shuffled.length >= 8) {
            if (Math.random() < 0.2) shuffled[2].role = new Tanner(shuffled[2]);
            if (Math.random() < 0.5) shuffled[3].role = new Mayor(shuffled[3]);
            if (Math.random() < 0.2) shuffled[4].role = new Bodyguard(shuffled[4]);
            if (Math.random() < 0.5) shuffled[5].role = new Lycan(shuffled[5]);
            if (Math.random() < 0.2) shuffled[6].role = new Hunter(shuffled[6]);
        }
        if (shuffled.length >= 9) {
            if (Math.random() < 0.3) shuffled[2].role = new Tanner(shuffled[2]);
            if (Math.random() < 0.75) shuffled[3].role = new Mayor(shuffled[3]);
            if (Math.random() < 0.4) shuffled[4].role = new Bodyguard(shuffled[4]);
            if (Math.random() < 0.75) shuffled[5].role = new Lycan(shuffled[5]);
            if (Math.random() < 0.4) shuffled[6].role = new Hunter(shuffled[6]);
            if (Math.random() < 0.2) shuffled[7].role = new Sorceress(shuffled[7]);
            shuffled[8].role = new Werewolf(shuffled[8]);
        }
        if (shuffled.length >= 10) {
            if (Math.random() < 0.4) shuffled[2].role = new Tanner(shuffled[2]);
            if (Math.random() < 0.9) shuffled[3].role = new Mayor(shuffled[3]);
            if (Math.random() < 0.6) shuffled[4].role = new Bodyguard(shuffled[4]);
            if (Math.random() < 0.9) shuffled[5].role = new Lycan(shuffled[5]);
            if (Math.random() < 0.6) shuffled[6].role = new Hunter(shuffled[6]);
            if (Math.random() < 0.4) shuffled[7].role = new Sorceress(shuffled[7]);
            if (Math.random() < 0.33) shuffled[9].role = new Witch(shuffled[9]);
        }
        if (shuffled.length >= 11) {
            if (Math.random() < 0.5) shuffled[2].role = new Tanner(shuffled[2]);
            shuffled[3].role = new Mayor(shuffled[3]);
            if (Math.random() < 0.8) shuffled[4].role = new Bodyguard(shuffled[4]);
            shuffled[5].role = new Lycan(shuffled[5]);
            if (Math.random() < 0.8) shuffled[6].role = new Hunter(shuffled[6]);
            if (Math.random() < 0.65) shuffled[7].role = new Sorceress(shuffled[7]);
            if (Math.random() < 0.66) shuffled[9].role = new Witch(shuffled[9]);
            if (Math.random() < 0.4) shuffled[10].role = new Insomniac(shuffled[10]);
        }
        if (shuffled.length >= 12) {
            shuffled[4].role = new Bodyguard(shuffled[4]);
            shuffled[6].role = new Hunter(shuffled[6]);
            if (Math.random() < 0.9) shuffled[7].role = new Sorceress(shuffled[7]);
            if (Math.random() < 0.9) shuffled[9].role = new Witch(shuffled[9]);
            if (Math.random() < 0.8) shuffled[10].role = new Insomniac(shuffled[10]);
            shuffled[11].role = new Werewolf(shuffled[11]);
        }
        if (shuffled.length >= 13) {
            shuffled[7].role = new Sorceress(shuffled[7]);
            shuffled[9].role = new Witch(shuffled[9]);
            shuffled[10].role = new Insomniac(shuffled[10]);
            shuffled[12].role = new Minion(shuffled[12]);
        }

        if (Math.random() < 0.7 && shuffled.length >= 8) {
            const newShuffle = shuffle(this.players.all);
            const oldRole = newShuffle[0].role;
            newShuffle[0].role = new Drunk(newShuffle[0], oldRole);
        }

        // New shuffle.
        if (shuffled.length >= 12) {
            // Masons!
            const newShuffle = shuffle(this.players.normalVillagers);
            if (newShuffle.length >= 2 && Math.random() < 0.6) {
                newShuffle[0].role = new Mason(newShuffle[0]);
                newShuffle[1].role = new Mason(newShuffle[1]);
            }
        }
    }

    // Role processes.
    processLynchElimination(): void {
        // Go through each player and tally up the votes.
        const votes = new Map<Player, number>();
        for (const [, player] of this._players) {
            if (player.accusing) {
                const value = votes.get(player.accusing);
                if (player.role instanceof Mayor) {
                    if (value) {
                        votes.set(player.accusing, value + 2);
                    } else {
                        votes.set(player.accusing, 2);
                    }
                } else {
                    if (value) {
                        votes.set(player.accusing, value + 1);
                    } else {
                        votes.set(player.accusing, 1);
                    }
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
    processWerewolfElimination(): boolean {
        if (this.processWitchSave()) return false;

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
            return true;
        }
        else if (sorted.length > 1) {
            if (sorted[0][1] > sorted[1][1]) {
                sorted[0][0].alive = false;
                this.send(ElimEmbeds.werewolf(sorted[0][0]));
                return true;
            }
        }

        return false;
    }
    processHunterElimination(): boolean {
        let killed = false;

        this.players.all.forEach((player) => {
            if (player.role instanceof Hunter) {
                if (!player.alive && player.role.target && player.role.target.alive && !player.role.shot) {
                    this.send(ElimEmbeds.hunter(player.role.target, player));
                    player.role.shot = true;
                    killed = true;
                }
            }
        });

        return killed;
    }
    processWitchElimination(): boolean {
        let killed = false;

        this.players.all.forEach((player) => {
            if (player.role instanceof Witch) {
                if (!player.alive && player.role.target && player.role.target.alive && !player.role.usedDeath) {
                    this.send(ElimEmbeds.hunter(player.role.target, player));
                    player.role.usedDeath = true;
                    killed = true;
                }
            }
        });

        return killed;
    }
    processSeerInspection(player: Player): void {
        if (player.role instanceof Seer && player.role.target) {
            if (player.alive) {
                player.send(
                    `You have learned that ${player.role.target} is a ${player.role.target.role.appearance}.`
                );
                player.role.target = undefined;
            } else {
                player.send(
                    `You have met an unfortunate end before you could learn about ${player.role.target}. May you rest peacefully in the next life.`
                );
                player.role.target = undefined;
            }
        }
    }
    processSorceressInspection(player: Player): void {
        if (player.role instanceof Sorceress && player.role.target) {
            if (player.alive) {
                player.send(
                    `You have learned that ${player.role.target} is ${player.role.target.role instanceof Seer ? "" : "not"} the seer.`
                );
                player.role.target = undefined;
            } else {
                player.send(
                    `You have met an unfortunate end before you could learn about ${player.role.target}. May you rest peacefully in the next life.`
                );
                player.role.target = undefined;
            }
        }
    }
    processInsomniacInspection(player: Player): void {
        if (player.role instanceof Insomniac && player.role.target) {
            if (player.alive) {
                player.send(
                    `You have learned that ${player.role.target} did ${player.role.target.role.usedAction ? "" : "not"} do something last night.`
                );
                player.role.target = undefined;
            } else {
                player.send(
                    `You have met an unfortunate end before you could learn about ${player.role.target}. May you rest peacefully in the next life.`
                );
                player.role.target = undefined;
            }
        }
    }
    processWitchSave(): boolean {
        let saving = false;

        this.players.alive.forEach((player) => {
            if (player.role instanceof Witch && player.role.saving) {
                saving = true;
                player.role.usedSave = true;
            }
        });

        return saving;
    }

    winCondition(): boolean {
        const players = this.players;

        const vCount = players.aliveVillagers.length;
        const wCount = players.aliveWerewolves.length;

        if (players.deadTanners.length > 0) {
            // Tanner win.
            this.send(Embeds.tannerVictoryEmbed(players.all));
        }
        else if (vCount === 0 || wCount >= vCount) {
            // Werewolves win.
            this.send(Embeds.werewolfVictoryEmbed(players.all));
            return true;
        }
        else if (wCount === 0) {
            // Villagers win.
            this.send(Embeds.villagerVictoryEmbed(players.all));
            return true;
        }

        return false;
    }

    get id():           string {
        return this._notificationChannel.guild.id;
    }
    get channel():      Discord.TextChannel {
        return this._notificationChannel;
    }
    get channelId():    string {
        return this._notificationChannel.id;
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
        const deadTanners:     Player[] = [];
        const masons:          Player[] = [];
        const normalVillagers: Player[] = [];

        this._players.forEach((player) => {
            all.push(player);

            if (player.role instanceof Mason) {
                masons.push(player);
            }

            if (player.role instanceof Villager) {
                normalVillagers.push(player);
            }

            if (player.alive) {
                alive.push(player);

                if (player.role instanceof Werewolf) {
                    aliveWerewolves.push(player);
                } else {
                    aliveVillagers.push(player);
                }
            } else {
                if (player.role instanceof Tanner) {
                    deadTanners.push(player);
                }

                dead.push(player);
            }
        });

        return {
            all,
            dead,
            alive,
            aliveVillagers,
            aliveWerewolves,
            deadTanners,
            masons,
            normalVillagers
        };
    }
    get active():       boolean {
        return this._active;
    }
    set active(value: boolean) {
        this._active = value;
    }
    get phase():        Phase {
        return this._phase;
    }
}

type Players = {
    all: Player[];
    alive: Player[];
    dead: Player[];
    aliveWerewolves: Player[];
    aliveVillagers: Player[];
    deadTanners: Player[];
    masons: Player[];
    normalVillagers: Player[];
}
