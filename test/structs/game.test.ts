import * as Discord from "discord.js";
import Game from "../../src/structs/game";
import Phase from "../../src/structs/phase";

let game: Game, channel: Discord.TextChannel;
beforeEach(() => {
    channel = { send: () => 0, guild: { id: "1" } } as unknown as Discord.TextChannel;
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

    test("A game object must have a `players` array.", () => {
        expect(game.players).toEqual([]);
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
