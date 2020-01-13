import Player from "../../structs/player";
import Game from "../../structs/game";
import Role from "../../interfaces/role";
import { generatePlayer } from "../fixtures/generate";

let player: Player;
beforeEach(() => {
    player = generatePlayer("1234");
});

it("should have default value for player on instantiation", () => {
    expect(player.alive).toBe(true);
    expect(player.role).toBeUndefined();
});
it("should set predefined values for player if defined during instantiation", () => {
    player = new Player({
        id: "12345",
        name: "Tester",
        game: {} as Game,
        send: (): number => 0,
        alive: false,
        role: {} as Role,
    });

    expect(player.alive).toBe(false);
    expect(player.role).not.toBeUndefined();
});

it("should not send role if role is not defined", () => {
    player.sendRole();

    expect(player.send).not.toBeCalled();
});
it("should send role if role is defined", () => {
    player.role = { getRoleMessage: () => 0 } as Role;
    player.sendRole();

    expect(player.send).toBeCalled();
});

it("should not send night role information if role is not defined", () => {
    player.sendNightActions();

    expect(player.send).not.toBeCalled();
});
it("should not send night role information if role is defined, but not night-active", () => {
    player.role = {} as Role;
    player.sendNightActions();

    expect(player.send).not.toBeCalled();
});
it("should send night role information if role is defined with a night-active role", () => {
    player.role = { getNightRoleMessage: () => 0 } as Role;
    player.sendNightActions();

    expect(player.send).toBeCalled();
});
