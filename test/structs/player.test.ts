import * as Discord from "discord.js";
import * as Fixture from "../fixtures/guild-member";

import Player   from "../../src/structs/player";
import Game     from "../../src/structs/game";
import Villager from "../../src/roles/villager";
import Phase    from "../../src/structs/phase";

let player: Player, member: Discord.GuildMember, game: Game;
beforeEach(() => {
    member = Fixture.createMember("1", "Test");
    game = new Game({} as Discord.TextChannel, { phase: Phase.Day, active: true, day: 1 });
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

describe("accuse()", () => {
    let accused: Player;
    beforeEach(() => {
        accused = new Player(Fixture.createMember("2", "Accused"), game);
    });

    test("Should set accusing property when passed a player and return true on success.", () => {
        const success = player.accuse(accused);

        expect(player.accusing).toBe(accused);
        expect(success).toBe(true);

        expect(player.send).toHaveBeenCalledWith("You are now voting to lynch <@!2>.");
    });
    test("Should not set accusing property when passed the same player.", () => {
        const success = player.accuse(player);

        expect(player.accusing).toBeNull();
        expect(success).toBe(false);

        expect(player.send).toHaveBeenCalledWith("You cannot vote to lynch yourself.");
    });
    test("Should not allow accusations to be set if player is dead.", () => {
        player = new Player(member, game, { alive: false, accusing: null });

        const success = player.accuse(accused);

        expect(player.accusing).toBeNull();
        expect(success).toBe(false);

        expect(player.send).toHaveBeenCalledWith("You cannot vote to lynch players when you are eliminated.");
    });
    test("Should not allow accusations when game is not active.", () => {
        game = new Game({} as Discord.TextChannel, { phase: Phase.Day, active: false, day: 1 });
        player = new Player(member, game);

        const success = player.accuse(accused);

        expect(player.accusing).toBeNull();
        expect(success).toBe(false);

        expect(player.send).toHaveBeenCalledWith("You cannot vote to lynch players when the game is not active.");
    });
    test("Should not allow accusations to be set if target is dead.", () => {
        const accused = new Player(
            Fixture.createMember("2", "Accused"), game, { alive: false, accusing: null });

        const success = player.accuse(accused);

        expect(player.accusing).toBeNull();
        expect(success).toBe(false);

        expect(player.send).toHaveBeenCalledWith("You cannot vote to lynch eliminated players.");
    });
    test("Should not allow accusations outside the day phase.", () => {
        game = new Game({} as Discord.TextChannel, { phase: Phase.Night, active: true, day: 1 });
        player = new Player(member, game);

        const success = player.accuse(accused);

        expect(player.accusing).toBeNull();
        expect(success).toBe(false);

        expect(player.send).toHaveBeenCalledWith("You cannot vote to lynch players outside the day phase.");
    });
});
