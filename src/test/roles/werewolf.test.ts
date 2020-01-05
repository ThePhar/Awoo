import Werewolf from "../../roles/werewolf";

const role = new Werewolf();

it("should have required fields", () => {
    expect(role.name).toBe("Werewolf");
    expect(role.appearance).toBe("werewolf");
});
