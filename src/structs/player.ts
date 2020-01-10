import PlayerData from "../interfaces/player-data";
import Role from "../interfaces/role";
import Game from "./game";

export default class Player {
    name: string;
    id: string;
    game: Game;
    alive: boolean;
    role?: Role;
    accusing?: Player;

    send: Function;

    constructor(data: PlayerData) {
        this.name = data.name;
        this.id = data.id;
        this.game = data.game;
        this.role = data.role;

        // Assign implementation specific functions.
        this.send = data.send;

        // Generate default values if not already specified.
        this.alive = data.alive === undefined ? true : data.alive;
    }

    sendRole(): void {
        if (this.role) {
            this.send(this.role.getRoleMessage());
        }
    }
    sendNightRole(): void {
        if (this.role && this.role.getNightRoleMessage) {
            this.send(this.role.getNightRoleMessage());
        }
    }
}
