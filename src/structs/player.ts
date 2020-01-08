import { User } from "discord.js";
import Role from "../interfaces/role";

export default class Player {
    client: User;
    role: Role | null;

    // Player state booleans.
    isAlive = true;
    isReady = false;
    hasVoted = false;

    // Player targeting values.
    accusing: Player | null;
    target: Player | null;

    constructor(client: User, role?: Role) {
        this.client = client;
        this.role = role || null;

        this.accusing = null;
        this.target = null;
    }

    resetChoices(): void {
        this.hasVoted = false;
        this.accusing = null;
        this.target = null;
    }
}
