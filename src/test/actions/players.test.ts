import * as ActionCreator from "../../actions/players";
import * as ActionType from "../../interfaces/player-actions";
import Role from "../../interfaces/role";
import { createStubPlayer } from "../_stubs/players";

/* Test Fixtures */
const stubPlayer = createStubPlayer();
const stubTarget = createStubPlayer();

it("should return an action object for addPlayer", () => {
    const action = ActionCreator.addPlayer(stubPlayer) as ActionType.PlayerAction;

    expect(action.type).toBe(ActionType.ADD_PLAYER);
    expect(action.player).toBe(stubPlayer);
});
it("should return an action object for removePlayer", () => {
    const action = ActionCreator.removePlayer(stubPlayer) as ActionType.PlayerAction;

    expect(action.type).toBe(ActionType.REMOVE_PLAYER);
    expect(action.player).toBe(stubPlayer);
});
it("should return an action object for accusePlayer", () => {
    const action = ActionCreator.accusePlayer(stubPlayer, stubTarget) as ActionType.PlayerTargetAction;

    expect(action.type).toBe(ActionType.ACCUSE_PLAYER);
    expect(action.player).toBe(stubPlayer);
    expect(action.target).toBe(stubTarget);
});
it("should return an action object for eliminatePlayer", () => {
    const action = ActionCreator.eliminatePlayer(stubPlayer) as ActionType.PlayerAction;

    expect(action.type).toBe(ActionType.ELIMINATE_PLAYER);
    expect(action.player).toBe(stubPlayer);
});
it("should return an action object for targetPlayer", () => {
    const action = ActionCreator.targetPlayer(stubPlayer, stubTarget) as ActionType.PlayerTargetAction;

    expect(action.type).toBe(ActionType.TARGET_PLAYER);
    expect(action.player).toBe(stubPlayer);
    expect(action.target).toBe(stubTarget);
});
it("should return an action object for playerClearTarget", () => {
    const action = ActionCreator.playerClearTarget(stubPlayer) as ActionType.PlayerAction;

    expect(action.type).toBe(ActionType.PLAYER_CLEAR_TARGET);
    expect(action.player).toBe(stubPlayer);
});
it("should return an action object for clearAllAccusations", () => {
    const action = ActionCreator.clearAllAccusations();

    expect(action.type).toBe(ActionType.CLEAR_ALL_ACCUSATIONS);
});
it("should return an action object for assignPlayerRole", () => {
    const stubRole = {} as Role;
    const action = ActionCreator.assignPlayerRole(stubPlayer, stubRole) as ActionType.PlayerRoleAction;

    expect(action.type).toBe(ActionType.ASSIGN_PLAYER_ROLE);
    expect(action.player).toBe(stubPlayer);
    expect(action.role).toBe(stubRole);
});
