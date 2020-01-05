import Player from "../../classes/player";
import { Client, ClientUser } from "discord.js";

let client: ClientUser;
let player: Player;

beforeEach(() => {
    client = new ClientUser(new Client(), {});
    player = new Player(client);
});

it("should instantiate a Player object on constructor call", () => {
    expect(player).not.toBeUndefined();
});
it("should include a discord user's client as a property", () => {
    expect(player.client).toBeInstanceOf(ClientUser);
});
it("should include basic game properties", () => {
    expect(player.isAlive).not.toBeUndefined();
    expect(player.isReady).not.toBeUndefined();
});
