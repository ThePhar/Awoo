import { User } from "discord.js";
import Role from "../interfaces/role";
import NightActive from "../interfaces/night-active-role";
import { GameStore } from "../store/game";

export default class Player {
    // TODO: Use tag instead of name.
    client: User;
    role: Role | NightActive | null;
    game: GameStore;

    // Player state booleans.
    isAlive = true;
    isReady = false;

    // Player targeting values.
    accusing: Player | null;
    target: Player | null;

    constructor(client: User, game: GameStore, role?: Role) {
        this.client = client;
        this.role = role || null;
        this.game = game;

        this.accusing = null;
        this.target = null;
    }

    toString(): string {
        return `${this.client.toString()} :: \`${this.client.username}\``;
    }

    resetChoices(): void {
        this.accusing = null;
        this.target = null;
    }
}
