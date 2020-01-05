import Villager from "../../roles/villager";

const role = new Villager();

it("should have required fields", () => {
    expect(role.name).toBe("Villager");
    expect(role.appearance).toBe("villager");
});
