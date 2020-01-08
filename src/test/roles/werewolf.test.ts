import { RichEmbed } from "discord.js";
import Colors from "../../structs/colors";
import Werewolf from "../../roles/werewolf";
import RoleStrings from "../../strings/roles";
import { createStubPlayerWithWerewolves } from "../_stubs/players";
import NightActiveRole from "../../interfaces/night-active-role";

/* Test Fixtures */
const player = createStubPlayerWithWerewolves();
player.role = new Werewolf(player);

const role = player.role;

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
    it.todo("should not handle any actions if command is not `target`");
    it.todo("should not handle any actions if command has no arguments");
    it.todo("should return a message and exit if no target found");
    it.todo("should return a message and exit if target is the player");
    it.todo("should return a message and exit if target is dead");
    it.todo("should return a message and exit if attempting to target already targeted player");
    it.todo("should target and return a message to all werewolves on new target");
    it.todo("should target and return a message to all werewolves on change of target");
});
