import { createStore } from "redux";
import PlayersReducer from "../../reducers/players";
import {
    accusePlayer,
    addPlayer,
    eliminatePlayer,
    playerClearTarget,
    playerVote,
    readyPlayer,
    removePlayer,
    resetPlayerChoices,
    targetPlayer,
} from "../../actions/players";
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
it("should set the alive state of a player to dead on action ELIMINATE_PLAYER", () => {
    const player = createTestPlayer();

    store.dispatch(addPlayer(player));
    store.dispatch(eliminatePlayer(player));

    const state = store.getState() as Array<Player>;
    expect(state[0].isAlive).toBe(false);
});
it("should set the voted state of a player to dead on action VOTE_PLAYER", () => {
    const player = createTestPlayer();

    store.dispatch(addPlayer(player));
    store.dispatch(playerVote(player));

    const state = store.getState() as Array<Player>;
    expect(state[0].hasVoted).toBe(true);
});
it("should set the target of a player on action TARGET_PLAYER", () => {
    const player = createTestPlayer({ id: "123" });
    const target = createTestPlayer({ id: "135" });

    store.dispatch(addPlayer(player));
    store.dispatch(addPlayer(target));
    store.dispatch(targetPlayer(player, target));

    const state = store.getState() as Array<Player>;
    expect(state[0].target).toStrictEqual(target);
    expect(state[1].target).toBeNull();
});
it("should set the target of a player to null on action CLEAR_TARGET_PLAYER", () => {
    const player = createTestPlayer({ id: "123" });
    const target = createTestPlayer({ id: "135" });

    store.dispatch(addPlayer(player));
    store.dispatch(addPlayer(target));
    store.dispatch(targetPlayer(player, target));
    store.dispatch(playerClearTarget(player));

    const state = store.getState() as Array<Player>;
    expect(state[0].target).toBeNull();
});
it("should reset the player choices on action RESET_PLAYER_CHOICES", () => {
    const player = createTestPlayer();
    const target = createTestPlayer();

    store.dispatch(addPlayer(player));

    store.dispatch(playerVote(player));
    store.dispatch(targetPlayer(player, target));
    store.dispatch(accusePlayer(player, target));

    store.dispatch(resetPlayerChoices(player));

    const state = store.getState() as Array<Player>;
    expect(state[0].hasVoted).toBe(false);
    expect(state[0].accusing).toBeNull();
    expect(state[0].target).toBeNull();
});
