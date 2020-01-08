import { RichEmbed } from "discord.js";
import Colors from "../../structs/colors";
import Villager from "../../roles/villager";
import RoleStrings from "../../strings/roles";
import { createStubPlayer } from "../_stubs/players";

const role = new Villager(createStubPlayer());

it("should generate a role RichEmbed when embed is called with the appropriate strings.", () => {
    const embed = role.embed();

    expect(embed).toBeInstanceOf(RichEmbed);
    expect(embed.title).toBe("You are a Villager");
    expect(embed.description).toBe(RoleStrings.villager.description);
    expect(embed.color).toBe(Colors.VillagerBlue);
    expect(embed.thumbnail).toMatchObject({ url: RoleStrings.villager.thumbnailUrl });
});
