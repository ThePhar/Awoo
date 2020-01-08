import { Client, ClientUser } from "discord.js";
import Player from "../../../structs/player";

export function createTestClient(data = {}): ClientUser {
    return new ClientUser(new Client(), data);
}

export function createTestPlayer(data = {}): Player {
    const client = createTestClient(data);
    return new Player(client);
}
