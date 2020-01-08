import { Message, RichEmbed } from "discord.js";
import Colors from "../../structs/colors";
import Werewolf from "../../roles/werewolf";
import RoleStrings from "../../strings/roles";
import { createStubPlayer, createStubPlayerWithWerewolves } from "../_stubs/players";
import NightActiveRole from "../../interfaces/night-active-role";
import Command from "../../structs/command";
import { GameState, GameStore, initializeGame } from "../../store/game";
import Meta from "../../structs/meta";

type Mock = ReturnType<typeof jest.fn>;

/* Test Fixtures */
const player = createStubPlayerWithWerewolves("5001");
const store = player.game;
const message = ({ author: player, channel: { type: "dm" } } as unknown) as Message;

let send: Mock, role: NightActiveRole, dispatch: Mock;
beforeEach(() => {
    player.role = new Werewolf(player);
    role = player.role as NightActiveRole;

    player.user.send = jest.fn();
    send = player.user.send as Mock;

    player.game.dispatch = jest.fn();
    dispatch = player.game.dispatch as Mock;
});

describe("Message embeds", () => {
    it("should generate a role RichEmbed when embed is called with the appropriate strings.", () => {
        const embed = role.embed();

        expect(embed).toBeInstanceOf(RichEmbed);
        expect(embed.title).toBe("You are a Werewolf");
        expect(embed.description).toBe(RoleStrings.werewolf.description);
        expect(embed.color).toBe(Colors.WerewolfRed);
        expect(embed.thumbnail).toMatchObject({ url: RoleStrings.werewolf.thumbnailUrl });
    });
    it("should generate a role RichEmbed when nightEmbed is called with the appropriate strings.", () => {
        const embed = (role as NightActiveRole).nightEmbed();

        expect(embed).toBeInstanceOf(RichEmbed);
        expect(embed.title).toBe("On The Dinner Menu");
        expect(embed.description).toBe(RoleStrings.werewolf.nightDescription);
        expect(embed.color).toBe(Colors.WerewolfRed);
        expect(embed.thumbnail).toMatchObject({ url: RoleStrings.werewolf.thumbnailUrl });
    });
});

describe("Werewolf Night Action", () => {
    it("should ignore any actions if command is not `target`", () => {
        const command = new Command("test", message, []);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(0);
        expect(dispatch.mock.calls.length).toBe(0);
    });
    it("should not handle any actions if command has no arguments", () => {
        const command = new Command("target", message, []);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(1);
        expect(send.mock.calls[0][0].includes("please enter a name")).toBeTruthy();
        expect(dispatch.mock.calls.length).toBe(0);
    });
    it("should return a message and exit if no target found", () => {
        const command = new Command("target", message, ["test"]);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(1);
        expect(send.mock.calls[0][0].includes("I cannot find a player")).toBeTruthy();
        expect(dispatch.mock.calls.length).toBe(0);
    });
    it("should return a message and exit if target is the player", () => {
        store.getState = (): GameState => ({
            meta: {} as Meta,
            players: [player],
        });
        const command = new Command("target", message, [player.name.toLowerCase()]);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(1);
        expect(send.mock.calls[0][0].includes("You cannot target yourself")).toBeTruthy();
        expect(dispatch.mock.calls.length).toBe(0);
    });
    it("should return a message and exit if target is dead", () => {
        const deadPlayer = createStubPlayer("8001", "Test2");
        deadPlayer.isAlive = false;
        store.getState = (): GameState => ({
            meta: {} as Meta,
            players: [deadPlayer],
        });
        const command = new Command("target", message, [deadPlayer.name.toLowerCase()]);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(1);
        expect(send.mock.calls[0][0].includes("You cannot target eliminated players")).toBeTruthy();
        expect(dispatch.mock.calls.length).toBe(0);
    });
    it("should return a message and exit if attempting to target already targeted player", () => {
        const target = createStubPlayer("8001", "Test2");
        player.target = target;
        store.getState = (): GameState => ({
            meta: {} as Meta,
            players: [target],
        });
        const command = new Command("target", message, [target.name.toLowerCase()]);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(1);
        expect(send.mock.calls[0][0].includes("You are already targeting")).toBeTruthy();
        expect(dispatch.mock.calls.length).toBe(0);
    });
    it("should target and return a message to all werewolves on new target", () => {
        const werewolf2 = createStubPlayer("8001", "Test2");
        const villager = createStubPlayer("8002", "Test3");

        werewolf2.role = new Werewolf(werewolf2);

        store.getState = (): GameState => ({
            meta: {} as Meta,
            players: [player, werewolf2, villager],
        });
        const command = new Command("target", message, [villager.name.toLowerCase()]);
        role.nightAction(command);

        expect(send.mock.calls.length).toBe(1);
        expect(send.mock.calls[0][0].includes("has targeted")).toBeTruthy();
        expect(dispatch.mock.calls.length).toBe(1);
    });
    it.todo("should target and return a message to all werewolves on change of target");
});
