import {
    accusePlayer,
    addPlayer,
    assignPlayerRole,
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
    ASSIGN_PLAYER_ROLE,
    PlayerRoleAction,
} from "../../interfaces/players-actions";
import Villager from "../../roles/villager";

it("should return an action for adding a player", () => {
    const action = addPlayer(createTestPlayer());

    expect(action.type).toBe(ADD_PLAYER);
    expect(action.player).toStrictEqual(createTestPlayer());
});
it("should return an action for removing a player", () => {
    const action = removePlayer(createTestPlayer());

    expect(action.type).toBe(REMOVE_PLAYER);
    expect(action.player).toStrictEqual(createTestPlayer());
});
it("should return an action for marking a player as ready", () => {
    const action = readyPlayer(createTestPlayer());

    expect(action.type).toBe(READY_PLAYER);
    expect(action.player).toStrictEqual(createTestPlayer());
});
it("should return an action for accusing a player", () => {
    const player = createTestPlayer({ id: "123" });
    const accused = createTestPlayer({ id: "135" });

    const action = accusePlayer(player, accused) as PlayerTargetAction;

    expect(action.type).toBe(ACCUSE_PLAYER);
    expect(action.player).toStrictEqual(player);
    expect(action.target).toStrictEqual(accused);
});
it("should return an action for eliminating a player", () => {
    const player = createTestPlayer();

    const action = eliminatePlayer(player);

    expect(action.type).toBe(ELIMINATE_PLAYER);
    expect(action.player).toStrictEqual(player);
});
it("should return an action for targeting a player via night action", () => {
    const player = createTestPlayer({ id: "123" });
    const target = createTestPlayer({ id: "135" });

    const action = targetPlayer(player, target) as PlayerTargetAction;

    expect(action.type).toBe(TARGET_PLAYER);
    expect(action.player).toStrictEqual(player);
    expect(action.target).toStrictEqual(target);
});
it("should return an action for clearing a player's target", () => {
    const player = createTestPlayer();

    const action = playerClearTarget(player);

    expect(action.type).toBe(CLEAR_TARGET_PLAYER);
    expect(action.player).toStrictEqual(player);
});
it("should return an action for voting", () => {
    const player = createTestPlayer();

    const action = playerVote(player);

    expect(action.type).toBe(VOTE_PLAYER);
    expect(action.player).toStrictEqual(player);
});
it("should return an action for resetting all player choices", () => {
    const player = createTestPlayer();

    const action = resetPlayerChoices(player);

    expect(action.type).toBe(RESET_PLAYER_CHOICES);
    expect(action.player);
});
it("should return an action for assigning a role to a player", () => {
    const player = createTestPlayer();
    const role = new Villager();

    const action = assignPlayerRole(player, role) as PlayerRoleAction;

    expect(action.type).toBe(ASSIGN_PLAYER_ROLE);
    expect(action.player).toBe(player);
    expect(action.role).toBe(role);
});
