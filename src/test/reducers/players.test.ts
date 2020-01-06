import { createStore } from "redux";
import playersReducer from "../../reducers/players";
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
    store = createStore(playersReducer);
});

it("should create an empty Player Array on store creation", () => {
    expect(store.getState()).toBeInstanceOf(Array);
});

describe("Action handlers", () => {
    it("when ADD_PLAYER is fired, add a player to the state", () => {
        store.dispatch(addPlayer(createTestPlayer()));

        expect(store.getState()).toStrictEqual([createTestPlayer()]);
    });
    it("when REMOVE_PLAYER is fired, remove a player from the state", () => {
        const player1 = createTestPlayer({ id: "123" });
        const player2 = createTestPlayer({ id: "124" });
        const player3 = createTestPlayer({ id: "125" });

        store.dispatch(addPlayer(player1));
        store.dispatch(addPlayer(player2));
        store.dispatch(addPlayer(player3));

        store.dispatch(removePlayer(player2));

        expect(store.getState()).toStrictEqual([player1, player3]);
    });
    it("when READY_PLAYER is fired, set player's ready state to true", () => {
        const player1 = createTestPlayer({ id: "123" });
        const player2 = createTestPlayer({ id: "123" });

        store.dispatch(addPlayer(player1));
        store.dispatch(addPlayer(player2));
        store.dispatch(readyPlayer(player1));

        const state = store.getState() as Array<Player>;
        expect(state[0].isReady).toBe(true);
        expect(state[1].isReady).toBe(false);
    });
    it("when ACCUSE_PLAYER is fired, set accused to targeted player", () => {
        const player = createTestPlayer({ id: "123" });
        const accused = createTestPlayer({ id: "135" });

        store.dispatch(addPlayer(player));
        store.dispatch(addPlayer(accused));
        store.dispatch(accusePlayer(player, accused));

        const state = store.getState() as Array<Player>;
        expect(state[0].accusing).toStrictEqual(accused);
        expect(state[1].accusing).toBeNull();
    });
    it("when ELIMINATE_PLAYER is fired, set the alive state of a player to false", () => {
        const player = createTestPlayer();

        store.dispatch(addPlayer(player));
        store.dispatch(eliminatePlayer(player));

        const state = store.getState() as Array<Player>;
        expect(state[0].isAlive).toBe(false);
    });
    it("when VOTE_PLAYER is fired, set the voted state of a player true", () => {
        const player = createTestPlayer();

        store.dispatch(addPlayer(player));
        store.dispatch(playerVote(player));

        const state = store.getState() as Array<Player>;
        expect(state[0].hasVoted).toBe(true);
    });
    it("when TARGET_PLAYER is fired, set the target to targeted player", () => {
        const player = createTestPlayer({ id: "123" });
        const target = createTestPlayer({ id: "135" });

        store.dispatch(addPlayer(player));
        store.dispatch(addPlayer(target));
        store.dispatch(targetPlayer(player, target));

        const state = store.getState() as Array<Player>;
        expect(state[0].target).toStrictEqual(target);
        expect(state[1].target).toBeNull();
    });
    it("when CLEAR_TARGET_PLAYER is fired, clear the target of the player", () => {
        const player = createTestPlayer({ id: "123" });
        const target = createTestPlayer({ id: "135" });

        store.dispatch(addPlayer(player));
        store.dispatch(addPlayer(target));
        store.dispatch(targetPlayer(player, target));
        store.dispatch(playerClearTarget(player));

        const state = store.getState() as Array<Player>;
        expect(state[0].target).toBeNull();
    });
    it("when RESET_PLAYER_CHOICES is fired, set all choice variables to defaults", () => {
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
    it.todo("when ASSIGN_PLAYER_ROLE is fired, create a new role for player");
});
