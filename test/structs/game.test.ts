import * as Discord from "discord.js";
import * as Fixture from "../fixtures/guild-member";

import Game   from "../../src/structs/game";
import Phase  from "../../src/structs/phase";
import Player from "../../src/structs/player";
import { createMember } from "../fixtures/guild-member";
import Werewolf from "../../src/roles/werewolf";

let game: Game, channel: Discord.TextChannel;
beforeEach(() => {
    channel = { send: jest.fn(), guild: { id: "1" } } as unknown as Discord.TextChannel;
    game = new Game(channel);
});

describe("constructor() & Properties", () => {
    test("A game object must have an `id` property.", () => {
        expect(game.id).toBe("1");
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

describe("initializeGame()", () => {
    test("Should send role information to every single player.", () => {
        const member1 = createMember("1", "Test");
        const member2 = createMember("2", "Test");

        game.addPlayer(member1);
        game.addPlayer(member2);

        game.initializeGame();

        expect((member1.send as jest.Mock).mock.calls[0][0].title)
            .toBe("You are a Villager");
        expect((member2.send as jest.Mock).mock.calls[0][0].title)
            .toBe("You are a Villager");
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

        expect((channel.send as jest.Mock).mock.calls[0][0].title)
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
    test("Should clear all accusations made by players.", () => {
        const player1 = game.addPlayer(Fixture.createMember("1", "Test")) as Player;
        const player2 = game.addPlayer(
            Fixture.createMember("2", "Test"), { accusing: player1, alive: true }) as Player;

        game.startNightPhase();

        expect(player2.accusing).toBeNull();
    });
    test("Should send a new day notification if no win condition was met.", () => {
        game.startNightPhase();

        expect((channel.send as jest.Mock).mock.calls[1][0].title)
            .toBe("Start of Night 2");
    });

    test("Should eliminate a player with the most accusations.", () => {
        const accusedPlayer = game.addPlayer(createMember("1", "Accused")) as Player;
        const secondPlayer  = game.addPlayer(createMember("2", "Second")) as Player;
        const accuseState1 = { accusing: accusedPlayer, alive: true };
        const accuseState2 = { accusing: secondPlayer, alive: true };

        game.addPlayer(createMember("3", "Test"), accuseState1);
        game.addPlayer(createMember("4", "Test"), accuseState1);
        game.addPlayer(createMember("5", "Test"), accuseState1);
        game.addPlayer(createMember("6", "Test"), accuseState2);
        game.addPlayer(createMember("7", "Test"), accuseState2);

        game.startNightPhase();
        expect(accusedPlayer.alive).toBe(false);
        expect(secondPlayer.alive).toBe(true);
    });
    test("Should not eliminate a player if there is a tie.", () => {
        const accusedPlayer = game.addPlayer(createMember("1", "Accused")) as Player;
        const secondPlayer  = game.addPlayer(createMember("2", "Second")) as Player;
        const accuseState1 = { accusing: accusedPlayer, alive: true };
        const accuseState2 = { accusing: secondPlayer, alive: true };

        game.addPlayer(createMember("3", "Test"), accuseState1);
        game.addPlayer(createMember("4", "Test"), accuseState1);
        game.addPlayer(createMember("5", "Test"), accuseState2);
        game.addPlayer(createMember("6", "Test"), accuseState2);

        game.startNightPhase();
        expect(accusedPlayer.alive).toBe(true);
        expect(secondPlayer.alive).toBe(true);
    });
    test("Should not eliminate a player if there are no votes.", () => {
        game.addPlayer(createMember("1", "Test"));
        game.addPlayer(createMember("2", "Test"));
        game.addPlayer(createMember("3", "Test"));

        game.startNightPhase();
        expect(game.players.alive.length).toBe(3);
    })
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
    test("Should allow predefined player state when creating a player.", () => {
        const member = Fixture.createMember("1", "Test");

        const player = game.addPlayer(member, { accusing: null, alive: false });

        expect(player).toBeDefined();
        expect(player).toHaveProperty("alive", false);
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
describe("getPlayers()", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let player1, player2, player3, player4, player5, player6, player7, player8;
    beforeEach(() => {
        const deadState = { alive: false, accusing: null };

        player1 = game.addPlayer(Fixture.createMember("1", "Test"))            as Player;
        player2 = game.addPlayer(Fixture.createMember("2", "Test"))            as Player;
        player3 = game.addPlayer(Fixture.createMember("3", "Test"))            as Player;
        player4 = game.addPlayer(Fixture.createMember("4", "Test"))            as Player;
        player5 = game.addPlayer(Fixture.createMember("5", "Test"))            as Player;
        player6 = game.addPlayer(Fixture.createMember("6", "Test"))            as Player;
        player7 = game.addPlayer(Fixture.createMember("7", "Test"), deadState) as Player;
        player8 = game.addPlayer(Fixture.createMember("8", "Test"), deadState) as Player;

        player4.role = new Werewolf(player4);
        player5.role = new Werewolf(player5);
    });

    test("Should return an object with an array of all players.", () => {
        expect(game.players.all.length).toBe(8);
    });
    test("Should return an object with an array of alive players.", () => {
        expect(game.players.alive.length).toBe(6);
    });
    test("Should return an object with an array of dead players.", () => {
        expect(game.players.dead.length).toBe(2);
    });
    test("Should return an object with an array of all alive werewolves.", () => {
        expect(game.players.aliveWerewolves.length).toBe(2);
    });
    test("Should return an object with an array of all alive villagers (non-werewolves).", () => {
        expect(game.players.aliveVillagers.length).toBe(4);
    });
});
