import Player from "../../structs/player";
import { ClientUser } from "discord.js";
import Villager from "../../roles/villager";
import { createTestClient, createTestPlayer } from "../fixtures/player";

const player = createTestPlayer();
const client = createTestClient();

it("should include a discord user's client as a property", () => {
    expect(player.client).toBeInstanceOf(ClientUser);
});
it("should include basic game properties", () => {
    expect(player.isAlive).not.toBeUndefined();
    expect(player.isReady).not.toBeUndefined();
    expect(player.hasVoted).not.toBeUndefined();
    expect(player.accusing).not.toBeUndefined();
    expect(player.target).not.toBeUndefined();
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
