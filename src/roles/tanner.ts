import Role from "../interfaces/role";
import Player from "../structs/player";
import Team from "../structs/team";

export default class Tanner implements Role {
    name = "Tanner";
    pluralName = "Tanners";
    appearance = "villager";
    team = Team.Tanner;

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
