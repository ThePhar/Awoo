import Role from "../interfaces/role";
import Player from "../structs/player";
import Team from "../structs/team";

export default class Lycan implements Role {
    name = "Lycan";
    pluralName = "Lycans";
    appearance = "werewolf";
    team = Team.Villagers;

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
        // Lycans have no special actions.
        return;
    }
}
