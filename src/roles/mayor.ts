import Role from "../interfaces/role";
import Player from "../structs/player";
import Teams from "../structs/teams";

export default class Mayor implements Role {
    name = "Mayor";
    pluralName = "Mayors";
    appearance = "villager";
    team = Teams.Villagers;

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
        // Mayors have no special actions.
        return;
    }
}
