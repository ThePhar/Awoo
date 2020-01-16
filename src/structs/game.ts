import Player from "./player";
import Phases from "./phases";
import GameData from "../interfaces/game-data";

export default class Game {
    id: string;
    active: boolean;
    phase: Phases;
    day: number;

    players: Array<Player> = [];

    send?: Function;

    constructor(data: GameData) {
        this.id = data.id;
        this.active = data.active || false;
        this.phase = data.phase || Phases.WaitingForPlayers;
        this.day = data.day || 0;
        this.send = data.send;
    }

    // Player specific functions
    getPlayers(nameOrId: string): Array<Player> {
        const regex = /<@!?([0-9]+)>/;

        if (regex.test(nameOrId)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            nameOrId = regex.exec(nameOrId)[1];
        }

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
}
