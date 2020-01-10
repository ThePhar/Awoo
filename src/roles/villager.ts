import Role from "../interfaces/role";
import Player from "../structs/player";
import Teams from "../structs/teams";

export default class Villager implements Role {
    name = "Villager";
    pluralName = "Villagers";
    appearance = "villager";
    team = Teams.Villagers;

    player: Player;
    getRoleMessage: () => unknown;

    constructor(player: Player, getRoleMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
    }
}
