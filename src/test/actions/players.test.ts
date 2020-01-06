import { addPlayer, readyPlayer, removePlayer } from "../../actions/players";
import { createTestPlayer } from "../fixtures/player";
import { ADD_PLAYER, READY_PLAYER, REMOVE_PLAYER } from "../../interfaces/players-actions";

it("should return an action for playerAdd", () => {
    const action = addPlayer(createTestPlayer());

    expect(action.type).toBe(ADD_PLAYER);
    expect(action.player).toStrictEqual(createTestPlayer());
});
it("should return an action for playerRemove", () => {
    const action = removePlayer(createTestPlayer());

    expect(action.type).toBe(REMOVE_PLAYER);
    expect(action.player).toStrictEqual(createTestPlayer());
});
it("should return an action for playerReady", () => {
    const action = readyPlayer(createTestPlayer());

    expect(action.type).toBe(READY_PLAYER);
    expect(action.player).toStrictEqual(createTestPlayer());
});
