import Game from "../../structs/game";
import Phases from "../../structs/phases";
import { generatePlayer } from "../fixtures/generate";
import Villager from "../../roles/villager";
import Werewolf from "../../roles/werewolf";

let game: Game;
beforeEach(() => {
    game = new Game({
        id: "12345",
        send: jest.fn(),
        sendNotification: jest.fn(),
    });
});

it("should have default value for game on instantiation", () => {
    expect(game.active).toBe(false);
    expect(game.phase).toBe(Phases.WaitingForPlayers);
    expect(game.day).toBe(0);
});
it("should set predefined values for game if defined during instantiation", () => {
    game = new Game({
        id: "12345",
        send: (): number => 0,
        sendNotification: (): number => 0,
        phase: Phases.Night,
        day: 10,
        active: true,
    });

    expect(game.active).toBe(true);
    expect(game.phase).toBe(Phases.Night);
    expect(game.day).toBe(10);
    expect(game.sendNotification).not.toBeUndefined();
});

describe("getPlayer", () => {
    it("should return an empty array if no player is found", () => {
        const players = game.getPlayers("987654321");

        expect(players.length).toBe(0);
    });
    it("should return a player that matches with an id", () => {
        game.addPlayer(generatePlayer("12345"));

        const players = game.getPlayers("12345");
        expect(players.length).toBe(1);
        expect(players[0].id).toBe("12345");
    });
    it("should return a player that matches with a name exactly", () => {
        game.addPlayer(generatePlayer("12345", "TestGuy"));

        const players = game.getPlayers("TestGuy");
        expect(players.length).toBe(1);
        expect(players[0].id).toBe("12345");
    });
    it("should return a player that partially matches a name", () => {
        game.addPlayer(generatePlayer("12345", "TestGuy"));

        const players = game.getPlayers("Test");
        expect(players.length).toBe(1);
        expect(players[0].id).toBe("12345");
    });
    it("should return multiple players if they match the same name", () => {
        game.addPlayer(generatePlayer("12345", "TestGuy"));
        game.addPlayer(generatePlayer("12346", "TestGirl"));

        const players = game.getPlayers("Test");
        expect(players.length).toBe(2);
        expect(players[0].id).toBe("12345");
        expect(players[1].id).toBe("12346");
    });
    it("should only return a player if their id matches even if someone has a name with their id", () => {
        game.addPlayer(generatePlayer("12345", "TestGuy"));
        game.addPlayer(generatePlayer("12346", "12345"));

        const players = game.getPlayers("12345");
        expect(players.length).toBe(1);
        expect(players[0].id).toBe("12345");
    });
});
describe("removePlayer", () => {
    it("should remove a player", () => {
        const playerToRemove = generatePlayer("12347", "TestBoy");

        game.addPlayer(generatePlayer("12345", "TestGuy"));
        game.addPlayer(playerToRemove);
        game.addPlayer(generatePlayer("12346", "TestGirl"));

        game.removePlayer(playerToRemove);
        expect(game.players.length).toBe(2);
        expect(game.players[0].id).toBe("12345");
        expect(game.players[1].id).toBe("12346");
    });
});

describe("startFirstNight", () => {
    it("should set day to 1 and set the phase to night", () => {
        game.startFirstNight();

        expect(game.active).toBe(true);
        expect(game.day).toBe(1);
        expect(game.phase).toBe(Phases.Night);
    });
    it("should send a message to each player of their roles", () => {
        const sendPlayerFunc = jest.fn();
        game.addPlayer(generatePlayer("12345", "Test1", game, sendPlayerFunc));
        game.addPlayer(generatePlayer("12346", "Test2", game, sendPlayerFunc));
        game.addPlayer(generatePlayer("12347", "Test3", game, sendPlayerFunc));

        // Assign a test role to each player
        for (const player of game.players) {
            player.role = new Villager(player, () => 0);
        }

        game.startFirstNight();

        expect(sendPlayerFunc).toHaveBeenCalledTimes(3);
    });
    it("should send a message to each player of their night action if exists", () => {
        const sendPlayerFunc = jest.fn();
        game.addPlayer(generatePlayer("12345", "Test1", game));
        game.addPlayer(generatePlayer("12346", "Test2", game));
        game.addPlayer(generatePlayer("12347", "Test3", game));

        // Assign a test role to each player
        for (const player of game.players) {
            player.role = new Villager(player, () => 0);
        }

        const player = generatePlayer("12348", "Werewolf", game);
        player.role = new Werewolf(player, () => 0, sendPlayerFunc);
        game.addPlayer(player);

        game.startFirstNight();

        expect(sendPlayerFunc).toHaveBeenCalledTimes(1);
    });
    it("should send a notification on the first night", () => {
        game.startFirstNight();

        expect(game.sendNotification).toHaveBeenCalled();
    });
});
