import * as Embeds from "../templates/embed-templates";

import Role               from "../interfaces/role";
import Team               from "../structs/team";
import Player             from "../structs/player";
import Command            from "../structs/command";
import RoleTemplate       from "../templates/role-templates";

export default class Minion implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.minion.name;
    readonly pluralName = RoleTemplate.minion.pluralName;
    readonly appearance = RoleTemplate.villager.appearance;
    readonly team       = Team.Werewolves;

    usedAction = false;

    constructor(player: Player) {
        this.player = player;
    }

    sendRole(): void {
        this.player.send(Embeds.minionRoleEmbed(this.player.game.guild, this.player.game.players.aliveWerewolves));
    }

    sendActionReminder(): void {
        // Reset target.
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    action(command: Command): boolean {
        return false;
    }
}
