import Role         from "../interfaces/role";
import Player       from "../structs/player";
import Team         from "../structs/team";
import RoleTemplate from "../templates/role-templates";

export default class Villager implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.villager.name;
    readonly pluralName = RoleTemplate.villager.pluralName;
    readonly appearance = RoleTemplate.villager.appearance;
    readonly team       = Team.Villagers;

    constructor(player: Player) {
        this.player = player;
    }
}
