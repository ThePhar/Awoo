import { createStore } from "redux";
import PlayersReducer from "../../reducers/players";
import { addPlayer, removePlayer } from "../../actions/players";
import { createTestPlayer } from "../fixtures/player";

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
