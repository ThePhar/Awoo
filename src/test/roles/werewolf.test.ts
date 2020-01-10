import Werewolf from "../../roles/werewolf";
import Command from "../../structs/command";
import Game from "../../structs/game";
import Player from "../../structs/player";
import { generatePlayer } from "../fixtures/generate";

let role: Werewolf;
let game: Game;
let player: Player, targetPlayer: Player, otherWerewolf: Player;
beforeEach(() => {
    game = new Game({
        id: "12345",
        send: jest.fn(),
        day: 3,
    });

    const sendFn = jest.fn();

    // Create our test players.
    player = generatePlayer("12345", "Werewolf", game, sendFn);
    otherWerewolf = generatePlayer("12348", "OtherWere", game, sendFn);
    targetPlayer = generatePlayer("87654", "Dummy", game, sendFn);

    // Add them to the game state.
    game.addPlayer(player);
    game.addPlayer(targetPlayer);
    game.addPlayer(otherWerewolf);

    otherWerewolf.role = new Werewolf(otherWerewolf, jest.fn(), jest.fn());

    player.role = new Werewolf(player, jest.fn(), jest.fn());
    role = player.role as Werewolf;
});

it("should return call getRoleMessage when player calls sendRole", () => {
    role.player.sendRole();

    expect(role.getRoleMessage).toBeCalled();
});
it("should return call getNightRoleMessage when player calls getNightRoleMessage", () => {
    role.player.sendNightRole();

    expect(role.getNightRoleMessage).toBeCalled();
});

describe("Night Action", () => {
    it("should not set a target if the command is not (target)", () => {
        const command = new Command("dance", ["Dummy"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).not.toHaveBeenCalled();
    });
    it("should not set a target during the first night", () => {
        game.day = 1;

        const command = new Command("target", ["Dummy"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith("You cannot target a player during the first night.");
    });
    it("should not set a target if no target specified in the command", () => {
        const command = new Command("target", []);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith("Please enter a target.");
    });
    it("should not set a target is no target is found.", () => {
        const command = new Command("target", ["ThisGuy"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith(
            "Sorry, I couldn't find a player by the name or id of `ThisGuy`",
        );
    });
    it("should not set a target if the player is attempting to target themselves.", () => {
        const command = new Command("target", ["Werewolf"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith("You cannot target yourself.");
    });
    it("should not set a target if the target is dead", () => {
        targetPlayer.alive = false;

        const command = new Command("target", ["Dummy"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith("You cannot target an eliminated player.");
    });
    it("should not set a target if attempting to target a werewolf", () => {
        const command = new Command("target", ["OtherWere"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith("You cannot target another werewolf.");
    });
    it("should not change a target if the new target is the same target", () => {
        (player.role as Werewolf).target = targetPlayer;

        const command = new Command("target", ["Dummy"]);
        role.nightAction(command);

        expect(role.player.send).toHaveBeenLastCalledWith("You are already targeting Dummy.");
    });
    it("should not change a target if multiple targets are found", () => {
        const command = new Command("target", ["Were"]);
        role.nightAction(command);

        expect(role.target).toBeUndefined();
        expect(role.player.send).toHaveBeenLastCalledWith(
            "Sorry, I found multiple players under that name. Please be more specific.",
        );
    });

    it("should set target on command (target) and notify all werewolves.", () => {
        const command = new Command("target", ["Dummy"]);
        role.nightAction(command);

        expect(role.target).toBe(targetPlayer);
        expect(role.player.send).toHaveBeenCalledTimes(2);
    });
    it("should set target on command (target) if changing target and notify all werewolves.", () => {
        role.target = otherWerewolf;

        const command = new Command("target", ["Dummy"]);
        role.nightAction(command);

        expect(role.target).toBe(targetPlayer);
        expect(role.player.send).toHaveBeenCalledTimes(2);
    });
});
