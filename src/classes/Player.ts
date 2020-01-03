import { ClientUser } from "discord.js";
import IRole from "../interfaces/IRole";

class Player {
    readonly client: ClientUser;
    role?: IRole;

    confirmed: boolean;
    alive: boolean;
    voted: boolean;
    activeNightAction: boolean;

    target?: Player;
    accuse?: Player;

    constructor(client: ClientUser) {
        this.client = client;

        this.confirmed = false;
        this.alive = true;
        this.voted = false;
        this.activeNightAction = false;
    }
    mention(): string {
        return `<@!${this.client.id}>`;
    }
}

export default Player;
