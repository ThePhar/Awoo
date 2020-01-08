import Werewolf from "../../../roles/werewolf";
import Colors from "../../../structs/colors";

const role = new Werewolf();

it("should have required fields", () => {
    expect(role.name).toBe("Werewolf");
    expect(role.appearance).toBe("werewolf");
});
it("should return appropriate embed for role", () => {
    const embed = role.embed();

    expect(embed.color).toBe(Colors.WerewolfRed);
    expect(embed.title).toContain("Werewolf");
});
