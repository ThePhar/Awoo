import { accusePlayer, addPlayer, readyPlayer, removePlayer } from "../../actions/players";
import { createTestPlayer } from "../fixtures/player";
import {
    ACCUSE_PLAYER,
    ADD_PLAYER,
    READY_PLAYER,
    REMOVE_PLAYER,
    PlayerTargetAction,
} from "../../interfaces/players-actions";

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
it("should return an action for playerAccuse", () => {
    const player = createTestPlayer({ id: "123" });
    const accused = createTestPlayer({ id: "135" });

    const action = accusePlayer(player, accused) as PlayerTargetAction;

    expect(action.type).toBe(ACCUSE_PLAYER);
    expect(action.player).toStrictEqual(player);
    expect(action.target).toStrictEqual(accused);
});
