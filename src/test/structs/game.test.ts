import Game from "../../structs/game";
import Phases from "../../structs/phases";
import { generatePlayer } from "../fixtures/generate";

let game: Game;
beforeEach(() => {
    game = new Game({
        id: "12345",
        send: jest.fn(),
    });
});

it("should have default value for game on instantiation", () => {
    expect(game.active).toBe(false);
    expect(game.phase).toBe(Phases.WaitingForPlayers);
    expect(game.day).toBe(0);
    expect(game.sendNotification).toBeUndefined();
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
