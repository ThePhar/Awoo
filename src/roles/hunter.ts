import * as Embeds from "../templates/embed-templates";

import Role               from "../interfaces/role";
import Team               from "../structs/team";
import Player             from "../structs/player";
import Command            from "../structs/command";
import RoleTemplate       from "../templates/role-templates";
import ActionTemplate     from "../templates/action-templates";
import RecognisedCommands from "../structs/recognised-command";

export default class Hunter implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.hunter.name;
    readonly pluralName = RoleTemplate.hunter.pluralName;
    readonly appearance = RoleTemplate.villager.appearance;
    readonly team       = Team.Villagers;

    usedAction = false;
    target?: Player;
    shot = false;

    constructor(player: Player) {
        this.player = player;
    }

    sendRole(): void {
        this.player.send(Embeds.hunterRoleEmbed(this.player.game.guild));
    }

    sendActionReminder(): void {
        if (!this.target || !this.target.alive) {
            this.player.send(Embeds.hunterActionEmbed(
                this.player.game.guild,
                this.player.game.players.alive,
                this.player)
            );
        }
    }

    action(command: Command): boolean {
        if (command.type === RecognisedCommands.Target) {
            // Player did not have a target.
            if (command.target === undefined && command.args === "") {
                this.player.send(ActionTemplate.hunter.noTarget());
                return false;
            }
            // Could not find that target.
            if (command.target === undefined) {
                this.player.send(ActionTemplate.hunter.noTargetFound(command.args));
                return false;
            }
            // Multiple players were found under that name.
            if (command.target instanceof Array) {
                this.player.send(ActionTemplate.hunter.multipleTargetsFound(command.target, command.args));
                return false;
            }
            // Target is dead.
            if (!command.target.alive) {
                this.player.send(ActionTemplate.hunter.deadTarget(command.target));
                return false;
            }
            // Player targeting themselves.
            if (command.target.id === this.player.id) {
                this.player.send(ActionTemplate.hunter.selfTarget());
                return false;
            }

            // All is good!
            this.target = command.target;
            this.player.send(ActionTemplate.hunter.success(this.target));
            return true;
        }

        // Not a command I understand, ignore it.
        return false;
    }
}
