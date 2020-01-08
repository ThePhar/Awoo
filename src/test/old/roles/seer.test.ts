import Seer from "../../../roles/seer";
import Colors from "../../../structs/colors";

const role = new Seer();

it("should have required fields", () => {
    expect(role.name).toBe("Seer");
    expect(role.appearance).toBe("villager");
});
it("should return appropriate embed for role", () => {
    const embed = role.embed();

    expect(embed.color).toBe(Colors.VillagerBlue);
    expect(embed.title).toContain("Seer");
});
