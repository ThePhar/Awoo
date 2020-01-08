import Player from "../../structs/player";
import { createStubGuildMember } from "../_stubs/clients";
import { createStubRole } from "../_stubs/roles";
import { createStubGameStore } from "../_stubs/stores";

/* Test Fixtures */
const stubGuildMember = createStubGuildMember("1234");
const stubGameStore = createStubGameStore();

const player = new Player(stubGuildMember, stubGameStore);

it("should generate a player object with the following default settings", () => {
    expect(player.user).toBe(stubGuildMember);
    expect(player.role).toBeNull();
    expect(player.game).toBe(stubGameStore);

    expect(player.isAlive).toBe(true);
    expect(player.accusing).toBeNull();
    expect(player.target).toBeNull();
});
it("should generate a player object with a predefined role", () => {
    const stubRole = createStubRole();
    const playerWithPredefinedRole = new Player(stubGuildMember, stubGameStore, stubRole);

    expect(playerWithPredefinedRole.role).toBe(stubRole);
});
it("should return a string with the mention and tag of the user when toString is called", () => {
    expect(player.toString()).toBe(`<@!1234> :: \`Test#4444\``);
});
it("should have an id and tag property that alias to respective client props", () => {
    expect(player.id).toBe(stubGuildMember.id);
    expect(player.name).toBe(stubGuildMember.user.tag);
});
