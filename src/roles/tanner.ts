import * as Embeds  from "../templates/embed-templates";

import Role         from "../interfaces/role";
import Player       from "../structs/player";
import Team         from "../structs/team";
import Command      from "../structs/command";
import RoleTemplate from "../templates/role-templates";

export default class Tanner implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.tanner.name;
    readonly pluralName = RoleTemplate.tanner.pluralName;
    readonly appearance = RoleTemplate.villager.appearance;
    readonly team       = Team.Tanner;

    usedAction = false;

    constructor(player: Player) {
        this.player = player;
    }

    sendRole(): void {
        this.player.send(Embeds.tannerRoleEmbed(this.player.game.guild));
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
