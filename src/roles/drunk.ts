import * as Embeds  from "../templates/embed-templates";

import Role         from "../interfaces/role";
import Player       from "../structs/player";
import Team         from "../structs/team";
import Command      from "../structs/command";
import RoleTemplate from "../templates/role-templates";

export default class Drunk implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.drunk.name;
    readonly pluralName = RoleTemplate.drunk.pluralName;
    readonly appearance: string;
    readonly team       = Team.Villagers;

    usedAction = false;
    trueRole: Role;

    constructor(player: Player, trueRole: Role) {
        this.player = player;
        this.trueRole = trueRole;
        this.appearance = trueRole.appearance;
    }

    sendRole(): void {
        this.player.send(Embeds.drunkRoleEmbed(this.player.game.guild));
    }

    // Villagers do not have actions, so do nothing.
    sendActionReminder(): void {
        if (this.player.game.day === 3) {
            const player = this.player;

            player.role = this.trueRole;
            player.role.sendRole();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    action(command: Command): boolean {
        return false;
    }
}
