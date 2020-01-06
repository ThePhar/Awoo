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
import {
    ACCUSE_PLAYER,
    ADD_PLAYER,
    ELIMINATE_PLAYER,
    READY_PLAYER,
    REMOVE_PLAYER,
    PlayerTargetAction,
    TARGET_PLAYER,
    CLEAR_TARGET_PLAYER,
    VOTE_PLAYER,
    RESET_PLAYER_CHOICES,
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
it("should return an action for playerEliminate", () => {
    const player = createTestPlayer();

    const action = eliminatePlayer(player);

    expect(action.type).toBe(ELIMINATE_PLAYER);
    expect(action.player).toStrictEqual(player);
});
it("should return an action for playerTarget", () => {
    const player = createTestPlayer({ id: "123" });
    const target = createTestPlayer({ id: "135" });

    const action = targetPlayer(player, target) as PlayerTargetAction;

    expect(action.type).toBe(TARGET_PLAYER);
    expect(action.player).toStrictEqual(player);
    expect(action.target).toStrictEqual(target);
});
it("should return an action for playerClearTarget", () => {
    const player = createTestPlayer();

    const action = playerClearTarget(player);

    expect(action.type).toBe(CLEAR_TARGET_PLAYER);
    expect(action.player).toStrictEqual(player);
});
it("should return an action for playerVote", () => {
    const player = createTestPlayer();

    const action = playerVote(player);

    expect(action.type).toBe(VOTE_PLAYER);
    expect(action.player).toStrictEqual(player);
});
it("should return an action for resetPlayerChoices", () => {
    const player = createTestPlayer();

    const action = resetPlayerChoices(player);

    expect(action.type).toBe(RESET_PLAYER_CHOICES);
    expect(action.player);
});
