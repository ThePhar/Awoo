import * as Discord from "discord.js";
import * as Fixture from "../fixtures/guild-member";

import Player       from "../../src/structs/player";
import Game         from "../../src/structs/game";
import Villager     from "../../src/roles/villager";

let player: Player, member: Discord.GuildMember, game: Game;
beforeEach(() => {
    member = Fixture.createMember("1", "Test");
    game = new Game({} as Discord.TextChannel);
    player = new Player(member, game);
});

describe("constructor() & Properties", () => {
    test("A player object must have an `id` property.", () => {
        expect(player.id).toBe("1");
    });
    test("A player object must have a `send` property mapped to a User send func.", () => {
        expect(player.send).toBe(member.send);
    });
    test("A player object must have a `tag` property mapped to a User tag.", () => {
        expect(player.tag).toBe("Test#4444");
    });
    test("A player object must have a `name` property mapped to a User displayName.", () => {
        expect(player.name).toBe("Test");
    });
    test("A player object must reference a `game` object.", () => {
        expect(player.game).toBe(game);
    });
    test("A player object must have an `alive` property.", () => {
        expect(player.alive).toBe(true);
    });
    test("A player object must have an `accusing` property.", () => {
        expect(player.accusing).toBeNull();
    });
    test("A player object must have a `role` property with a default of villager.", () => {
        expect(player.role).toBeInstanceOf(Villager);
    });
    test("A player object's toString method should return a Discord friendly mention string.", () => {
        expect(player.toString()).toBe("<@!1>");
    });
    test("Allow optional predetermined player state during instantiation to set initial player state.", () => {
        const player2 = new Player(member, game);
        player = new Player(member, game, {
            alive: false,
            accusing: player2,
        });

        expect(player.alive).toBe(false);
        expect(player.accusing).toBe(player2);
    });
});
