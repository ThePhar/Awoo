import Meta from "../../structs/meta";
import Player from "../../structs/player";
import Trial from "../../structs/trial";
import { initializeGame } from "../../store/game";

export interface GameState {
    meta: Meta;
    players: Array<Player>;
    trial: Trial;
}

it("should return a created game state store on initialization", () => {
    const game = initializeGame();

    const state = game.getState() as GameState;

    expect(state.meta).toBeInstanceOf(Meta);
    expect(state.players).toBeInstanceOf(Array);
    expect(state.trial).toBeInstanceOf(Trial);
});
