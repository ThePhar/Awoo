import Villager from "../../roles/villager";
import Colors from "../../structs/colors";

const role = new Villager();

it("should have required fields", () => {
    expect(role.name).toBe("Villager");
    expect(role.appearance).toBe("villager");
});
it("should return appropriate embed for role", () => {
    const embed = role.embed();

    expect(embed.color).toBe(Colors.VillagerBlue);
    expect(embed.title).toContain("Villager");
});
