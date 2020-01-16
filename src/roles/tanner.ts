import Role from "../interfaces/role";
import Player from "../structs/player";
import Teams from "../structs/teams";

export default class Tanner implements Role {
    name = "Tanner";
    pluralName = "Tanners";
    appearance = "villager";
    team = Teams.Tanner;

    player: Player;
    getRoleMessage: () => unknown;

    resetChoices(): void {
        this.player.accusing = undefined;
    }

    constructor(player: Player, getRoleMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
    }

    actionHandler(): void {
        // Villagers have no special actions.
        return;
    }
}
