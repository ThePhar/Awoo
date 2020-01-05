import { ClientUser } from "discord.js";
import Role from "../interfaces/role";

export default class Player {
    client: ClientUser;
    role: Role | null;

    // Player state booleans.
    isAlive = true;
    isReady = false;

    constructor(client: ClientUser, role?: Role) {
        this.client = client;
        this.role = role || null;
    }
}
