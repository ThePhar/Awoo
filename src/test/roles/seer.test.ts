import Werewolf from "../../roles/werewolf";
import Command from "../../structs/command";
import Game from "../../structs/game";
import Player from "../../structs/player";
import { generatePlayer } from "../fixtures/generate";
import Seer from "../../roles/seer";
import Villager from "../../roles/villager";

let role: Seer;
let game: Game;
let player: Player, villagePlayer: Player, werewolfPlayer: Player;
beforeEach(() => {
    game = new Game({
        id: "12345",
        send: jest.fn(),
        day: 3,
    });

    // Create our test players.
    player = generatePlayer("12345", "Seer", game);
    werewolfPlayer = generatePlayer("12348", "Werewolf", game);
    villagePlayer = generatePlayer("87654", "Villager", game);

    // Add them to the game state.
    game.addPlayer(player);
    game.addPlayer(villagePlayer);
    game.addPlayer(werewolfPlayer);

    werewolfPlayer.role = new Werewolf(werewolfPlayer, jest.fn(), jest.fn());
    villagePlayer.role = new Villager(villagePlayer, jest.fn());

    player.role = new Seer(player, jest.fn(), jest.fn());
    role = player.role as Seer;
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
    it("should not inspect a player if command not (target)", () => {
        const command = new Command("dance", ["Villager"]);
        role.nightAction(command);

        expect(role.active).toBe(true);
        expect(role.player.send).not.toHaveBeenCalled();
    });
    it("should not inspect a player if no target specified in the command", () => {
        const command = new Command("target", []);
        role.nightAction(command);

        expect(role.active).toBe(true);
        expect(role.player.send).toHaveBeenLastCalledWith("Please enter a target.");
    });
    it("should not inspect a player if no player found", () => {
        const command = new Command("target", ["ThisGuy"]);
        role.nightAction(command);

        expect(role.active).toBe(true);
        expect(role.player.send).toHaveBeenLastCalledWith(
            "Sorry, I couldn't find a player by the name or id of `ThisGuy`",
        );
    });
    it("should not inspect a player if no player found", () => {
        const command = new Command("target", ["Seer"]);
        role.nightAction(command);

        expect(role.active).toBe(true);
        expect(role.player.send).toHaveBeenLastCalledWith("You cannot inspect yourself.");
    });
    it("should not reinspect a player that has already been inspected", () => {
        role.inspected.push(villagePlayer);

        const command = new Command("target", ["Villager"]);
        role.nightAction(command);

        expect(role.active).toBe(true);
        expect(role.player.send).toHaveBeenLastCalledWith(
            "You have already inspected Villager before. They are a villager.",
        );
    });

    it("should throw an error if no role is specified on the target", () => {
        werewolfPlayer.role = undefined;

        const command = new Command("target", ["Werewolf"]);

        expect(() => role.nightAction(command)).toThrow();
    });

    it("should return the role of a villager as 'villager'", () => {
        const command = new Command("target", ["Villager"]);
        role.nightAction(command);

        expect(role.active).toBe(false);
        expect(role.inspected.length).toBe(1);
        expect(role.player.send).toHaveBeenLastCalledWith("You look into Villager's true self. They are a villager.");
    });
    it("should return the role of a werewolf as 'werewolf'", () => {
        const command = new Command("target", ["Werewolf"]);
        role.nightAction(command);

        expect(role.active).toBe(false);
        expect(role.inspected.length).toBe(1);
        expect(role.player.send).toHaveBeenLastCalledWith("You look into Werewolf's true self. They are a werewolf.");
    });
});
