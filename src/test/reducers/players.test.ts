import { createStore } from "redux";
import PlayersReducer from "../../reducers/players";
import { accusePlayer, addPlayer, readyPlayer, removePlayer } from "../../actions/players";
import { createTestPlayer } from "../fixtures/player";
import Player from "../../structs/player";

let store: ReturnType<typeof createStore>;
beforeEach(() => {
    store = createStore(PlayersReducer);
});

it("should create an empty Player Array on store creation", () => {
    expect(store.getState()).toBeInstanceOf(Array);
});
it("should on action ADD_PLAYER, add a player to the state", () => {
    store.dispatch(addPlayer(createTestPlayer()));

    expect(store.getState()).toStrictEqual([createTestPlayer()]);
});
it("should on action REMOVE_PLAYER, remove a player from the state", () => {
    const player1 = createTestPlayer({ id: "123" });
    const player2 = createTestPlayer({ id: "124" });
    const player3 = createTestPlayer({ id: "125" });

    store.dispatch(addPlayer(player1));
    store.dispatch(addPlayer(player2));
    store.dispatch(addPlayer(player3));

    store.dispatch(removePlayer(player2));

    expect(store.getState()).toStrictEqual([player1, player3]);
});
it("should set ready state to true for players on action READY_PLAYER", () => {
    const player1 = createTestPlayer({ id: "123" });
    const player2 = createTestPlayer({ id: "123" });

    store.dispatch(addPlayer(player1));
    store.dispatch(addPlayer(player2));
    store.dispatch(readyPlayer(player1));

    const state = store.getState() as Array<Player>;
    expect(state[0].isReady).toBe(true);
    expect(state[1].isReady).toBe(false);
});
it("should set the accused of a player on action ACCUSE_PLAYER", () => {
    const player = createTestPlayer({ id: "123" });
    const accused = createTestPlayer({ id: "135" });

    store.dispatch(addPlayer(player));
    store.dispatch(addPlayer(accused));
    store.dispatch(accusePlayer(player, accused));

    const state = store.getState() as Array<Player>;
    expect(state[0].accusing).toStrictEqual(accused);
    expect(state[1].accusing).toBeNull();
});
