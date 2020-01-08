import { createStore } from "redux";
import Player from "../../structs/player";
import * as ActionCreator from "../../actions/players";
import playersReducer from "../../reducers/players";
import { createStubPlayer } from "../_stubs/players";
import { createStubRole } from "../_stubs/roles";

/* Test Fixtures */
const stubPlayer = createStubPlayer("1001");
const stubTarget = createStubPlayer("1002");

let store: ReturnType<typeof createStore>;
beforeEach(() => {
    store = createStore(playersReducer);

    store.dispatch(ActionCreator.addPlayer(stubPlayer));
    store.dispatch(ActionCreator.addPlayer(stubTarget));
});

it("should on ADD_PLAYER, push the player to the state", () => {
    store.dispatch(ActionCreator.addPlayer(stubPlayer));

    const state = store.getState() as Array<Player>;
    expect(state.length).toBe(3);
    expect(state[2]).toBe(stubPlayer);
});
it("should on REMOVE_PLAYER, find and remove the player from the state", () => {
    store.dispatch(ActionCreator.removePlayer(stubPlayer));

    const state = store.getState() as Array<Player>;
    expect(state.length).toBe(1);
});
it("should on ACCUSE_PLAYER, set player's accusing field to accused player", () => {
    store.dispatch(ActionCreator.accusePlayer(stubPlayer, stubTarget));

    const state = store.getState() as Array<Player>;
    expect(state[0].accusing).toBe(stubTarget);
});
it("should on ELIMINATE_PLAYER, set player's isAlive property to false", () => {
    store.dispatch(ActionCreator.eliminatePlayer(stubPlayer));

    const state = store.getState() as Array<Player>;
    expect(state[0].isAlive).toBe(false);
});
it("should on TARGET_PLAYER, set player's target field to targeted player", () => {
    store.dispatch(ActionCreator.targetPlayer(stubPlayer, stubTarget));

    const state = store.getState() as Array<Player>;
    expect(state[0].target).toBe(stubTarget);
});
it("should on PLAYER_CLEAR_TARGET, set player's target field to null", () => {
    store.dispatch(ActionCreator.targetPlayer(stubPlayer, stubTarget));
    store.dispatch(ActionCreator.playerClearTarget(stubPlayer));

    const state = store.getState() as Array<Player>;
    expect(state[0].target).toBeNull();
});
it("should on CLEAR_ALL_ACCUSATIONS, set all player's accusing fields to null", () => {
    store.dispatch(ActionCreator.accusePlayer(stubPlayer, stubTarget));
    store.dispatch(ActionCreator.accusePlayer(stubTarget, stubPlayer));
    store.dispatch(ActionCreator.clearAllAccusations());

    const state = store.getState() as Array<Player>;
    expect(state[0].accusing).toBeNull();
    expect(state[1].accusing).toBeNull();
});
it("should on ASSIGN_PLAYER_ROLE, set the player's role field", () => {
    const stubRole = createStubRole();
    store.dispatch(ActionCreator.assignPlayerRole(stubPlayer, stubRole));

    const state = store.getState() as Array<Player>;
    expect(state[0].role).toBe(stubRole);
});
