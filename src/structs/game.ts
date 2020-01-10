import Player from "./player";
import Phases from "./phases";
import GameData from "../interfaces/game-data";

export default class Game {
    id: string;
    active: boolean;
    phase: Phases;
    day: number;

    players: Array<Player> = [];

    send: Function;
    sendNotification?: Function;

    constructor(data: GameData) {
        this.id = data.id;
        this.active = data.active || false;
        this.phase = data.phase || Phases.WaitingForPlayers;
        this.day = data.day || 0;

        // Assign implementation specific functions.
        this.send = data.send;
        this.sendNotification = data.sendNotification;
    }

    getPlayers(nameOrId: string): Array<Player> {
        let playerById;
        const players = this.players.filter(p => {
            if (p.id === nameOrId) {
                playerById = p;
            }

            return p.name.includes(nameOrId);
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
}
