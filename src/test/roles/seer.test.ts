import Seer from "../../roles/seer";

const role = new Seer();

it("should have required fields", () => {
    expect(role.name).toBe("Seer");
    expect(role.appearance).toBe("villager");
});
