import Villager from "../../roles/villager";
import { generatePlayer } from "../fixtures/generate";

let role: Villager;
beforeEach(() => {
    const player = generatePlayer("12345");

    player.role = new Villager(player, jest.fn());
    role = player.role;
});

it("should return call getRoleMessage when player calls sendRole", () => {
    role.player.sendRole();

    expect(role.getRoleMessage).toBeCalled();
});
