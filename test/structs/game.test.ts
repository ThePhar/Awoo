import * as Discord from "discord.js";
import * as Fixture from "../fixtures/guild-member";

import Game  from "../../src/structs/game";
import Phase from "../../src/structs/phase";

let game: Game, channel: Discord.TextChannel;
beforeEach(() => {
    channel = { send: jest.fn(), guild: { id: "1" } } as unknown as Discord.TextChannel;
    game = new Game(channel);
});

describe("constructor() & Properties", () => {
    test("A game object must have an `id` property.", () => {
        expect(game.id).toBe("1");
    });
    test("A game object must have a `send` property mapped to a TextChannel send func.", () => {
        expect(game.send).toBe(channel.send);
    });
    test("A game object must have an `active` property.", () => {
        expect(game.active).toBe(false);
    });
    test("A game object must have a `phase` property.", () => {
        expect(game.phase).toBe(Phase.Waiting);
    });
    test("A game object must have a `day` property.", () => {
        expect(game.day).toBe(0);
    });
    test("A game object must have a `players` map of size 0 at initialization.", () => {
        expect(game.totalPlayers).toBe(0);
    });
    test("Allow optional predetermined game state during instantiation to set initial game state.", () => {
        game = new Game(channel, {
            active: true,
            phase: Phase.Day,
            day: 3,
        });

        expect(game.active).toBe(true);
        expect(game.phase).toBe(Phase.Day);
        expect(game.day).toBe(3);
    });
});

describe("startDayPhase()", () => {
    beforeEach(() => {
        game = new Game(channel, { active: true, day: 1, phase: Phase.Night });
    });

    test("Should only set the phase to day.", () => {
        game.startDayPhase();

        expect(game.phase).toBe(Phase.Day);
        expect(game.day).toBe(1);
        expect(game.active).toBe(true);
    });

    test("Should send a new day notification if no win condition was met.", () => {
        game.startDayPhase();

        expect((game.send as jest.Mock).mock.calls[0][0].title)
            .toBe("Start of Day 1");
    });
});

describe("startNightPhase()", () => {
    beforeEach(() => {
        game = new Game(channel, { active: true, day: 1, phase: Phase.Day });
    });

    test("Should set the phase to night and increment day.", () => {
        game.startNightPhase();

        expect(game.phase).toBe(Phase.Night);
        expect(game.day).toBe(2);
        expect(game.active).toBe(true);
    });

    test("Should send a new day notification if no win condition was met.", () => {
        game.startNightPhase();

        expect((game.send as jest.Mock).mock.calls[0][0].title)
            .toBe("Start of Night 2");
    });
});

describe("addPlayer()", () => {
    test("Should create a player object, place into map, and return new player object.", () => {
        const member = Fixture.createMember("1", "Test");

        const player = game.addPlayer(member);
        expect(player).toBeDefined();
        expect(game.totalPlayers).toBe(1);
        expect(game.getPlayer(member.id)).toBe(player);
    });
    test("Should return undefined if a player is already signed up under that member.", () => {
        const member = Fixture.createMember("1", "Test");

        const firstAdd = game.addPlayer(member);
        const secondAdd = game.addPlayer(member);

        expect(secondAdd).toBeUndefined();
        expect(game.totalPlayers).toBe(1);
        expect(game.getPlayer(member.id)).toBe(firstAdd);
    });
});
describe("getPlayer()", () => {
    test("Should return the player object of a particular id if it exists.", () => {
        const member = Fixture.createMember("1", "Test");

        const instantiatedPlayer = game.addPlayer(member);
        const fetchedPlayer = game.getPlayer(member.id);

        expect(fetchedPlayer).toBe(instantiatedPlayer);
    });
    test("Should return undefined if a particular player does not exist.", () => {
        const player = game.getPlayer("12345");

        expect(player).toBeUndefined();
    });
});
describe("removePlayer()", () => {
    test("Should remove the player from the game and return the removed player object if it exists.", () => {
        const member = Fixture.createMember("1", "Test");

        const instantiatedPlayer = game.addPlayer(member);
        const removedPlayer = game.removePlayer(member.id);

        expect(removedPlayer).toBe(instantiatedPlayer);
        expect(game.totalPlayers).toBe(0);
        expect(game.getPlayer(member.id)).toBeUndefined();
    });
    test("Should return undefined if a particular player does not exist.", () => {
        const player = game.removePlayer("12345");

        expect(player).toBeUndefined();
    });
});
