import Player from "../../structs/player";
import Game from "../../structs/game";

export function generatePlayer(id: string, name?: string, game?: Game, send?: Function): Player {
    return new Player({
        id,
        name: name || "Tester",
        game: game || ({} as Game),
        send: send || jest.fn(),
    });
}
