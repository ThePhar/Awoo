import * as Embeds  from "../templates/embed-templates";

import Role         from "../interfaces/role";
import Player       from "../structs/player";
import Team         from "../structs/team";
import Command      from "../structs/command";
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

    sendRole(): void {
        this.player.send(Embeds.villagerRoleEmbed(this.player.game.guild));
    }

    // Villagers do not have actions, so do nothing.
    sendActionReminder(): void {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    action(command: Command): boolean {
        return false;
    }
}
