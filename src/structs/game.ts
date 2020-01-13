import Player from "./player";
import Phases from "./phases";
import GameData from "../interfaces/game-data";
import Werewolf from "../roles/werewolf";

export default class Game {
    id: string;
    active: boolean;
    phase: Phases;
    day: number;

    players: Array<Player> = [];

    send: Function;
    sendNotification: Function;

    constructor(data: GameData) {
        this.id = data.id;
        this.active = data.active || false;
        this.phase = data.phase || Phases.WaitingForPlayers;
        this.day = data.day || 0;

        // Assign implementation specific functions.
        this.send = data.send;
        this.sendNotification = data.sendNotification;
    }

    // Game specific functions
    startFirstNight(): void {
        this.active = true;
        this.day = 1;
        this.phase = Phases.Night;

        // Send each player their roles and night actions.
        this.sendAllPlayerRoles();
        this.sendAllPlayerNightActions();

        // Send a notification to the channel.
        this.sendNotification("Starting first night.");
    }
    startDay(): void {
        this.phase = Phases.Day;

        const win = this.processNightEliminations();
        if (win) {
            return;
        }

        // Send a notification to the channel.
        this.sendNotification("Starting day phase.");
    }
    startNight(): void {
        this.day += 1;
        this.phase = Phases.Night;

        const win = this.processDayEliminations();
        if (win) {
            return;
        }

        // Send all players their night actions.
        this.resetAllPlayerChoices();
        this.sendAllPlayerNightActions();

        // Send a notification to the channel.
        this.sendNotification("Starting night phase.");
    }

    // Elimination processing.
    processNightEliminations(): boolean {
        // Werewolves
        const werewolfTarget = Werewolf.getWerewolfElimination(this.players);
        if (werewolfTarget) {
            werewolfTarget.alive = false;
            this.sendNotification(`${werewolfTarget.name} has been eliminated by werewolves.`);
        }

        return this.checkForVictory();
    }
    processDayEliminations(): boolean {
        // Lynchings
        const lynchedPlayer = Player.getLynchElimination(this.players);
        if (lynchedPlayer) {
            lynchedPlayer.alive = false;
            this.sendNotification(`${lynchedPlayer.name} has been eliminated by lynching.`);
        }

        return this.checkForVictory();
    }

    // Victory processing.
    checkForVictory(): boolean {
        const aliveVillagers = this.players.filter(player => {
            return player.alive && player.role && !(player.role instanceof Werewolf);
        });
        const aliveWerewolves = this.players.filter(player => {
            return player.alive && player.role && player.role instanceof Werewolf;
        });

        // WEREWOLF VICTORY
        if (aliveWerewolves.length >= aliveVillagers.length) {
            this.sendNotification("Werewolves win!");
            return true;
        }
        // VILLAGER VICTORY
        else if (aliveWerewolves.length === 0) {
            this.sendNotification("Villagers win!");
            return true;
        }

        return false;
    }

    // Player specific functions
    getPlayers(nameOrId: string): Array<Player> {
        let playerById;
        const players = this.players.filter(p => {
            if (p.id === nameOrId) {
                playerById = p;
            }

            return p.name.toLowerCase().includes(nameOrId.toLowerCase());
        });

        // Return a player found by their id, or return all players with matching names.
        return playerById ? [playerById] : players;
    }
    addPlayer(player: Player): void {
        this.players.push(player);
    }
    removePlayer(player: Player): void {
        this.players = this.players.filter(p => p.id !== player.id);
    }
    resetAllPlayerChoices(): void {
        this.players.forEach(player => {
            if (player.role) {
                player.role.resetChoices();
            } else {
                console.error("A player does not have a role assigned!");
            }
        });
    }
    sendAllPlayerNightActions(): void {
        this.players.forEach(player => {
            if (player.alive) {
                player.sendNightActions();
            }
        });
    }
    sendAllPlayerRoles(): void {
        this.players.forEach(player => {
            if (player.alive) {
                player.sendRole();
            }
        });
    }
}
