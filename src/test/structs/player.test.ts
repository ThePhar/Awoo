import Player from "../../structs/player";
import { Client, ClientUser } from "discord.js";
import Villager from "../../roles/villager";

let client: ClientUser;
let player: Player;

beforeEach(() => {
    client = new ClientUser(new Client(), {});
    player = new Player(client);
});

it("should include a discord user's client as a property", () => {
    expect(player.client).toBeInstanceOf(ClientUser);
});
it("should include basic game properties", () => {
    expect(player.isAlive).not.toBeUndefined();
    expect(player.isReady).not.toBeUndefined();
});
it("should have a null role on instantiation", () => {
    expect(player.role).toBeNull();
});
it("should have a determined role when assigned", () => {
    player.role = new Villager();
    expect(player.role).toBeInstanceOf(Villager);
});
it("should allow to pass in an optional role during instantiating", () => {
    const predetermined = new Player(client, new Villager());
    expect(predetermined.role).toBeInstanceOf(Villager);
});
