import { ClientUser } from "discord.js";

export default class Player {
    client: ClientUser;

    // Player state booleans.
    isAlive = true;
    isReady = false;

    constructor(client: ClientUser) {
        this.client = client;
    }
}
