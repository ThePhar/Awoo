import * as Embeds from "../templates/embed-templates";

import Role               from "../interfaces/role";
import Team               from "../structs/team";
import Phase              from "../structs/phase";
import Player             from "../structs/player";
import Command            from "../structs/command";
import RoleTemplate       from "../templates/role-templates";
import ActionTemplate     from "../templates/action-templates";
import RecognisedCommands from "../structs/recognised-commands";

export default class Bodyguard implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.bodyguard.name;
    readonly pluralName = RoleTemplate.bodyguard.pluralName;
    readonly appearance = RoleTemplate.villager.appearance;
    readonly team       = Team.Villagers;

    usedAction = false;
    target?: Player;

    constructor(player: Player) {
        this.player = player;
    }

    sendRole(): void {
        this.player.send(Embeds.bodyguardRoleEmbed(this.player.game.guild));
    }

    sendActionReminder(): void {
        // Reset active.
        this.target = undefined;
        this.usedAction = false;

        this.player.send(Embeds.bodyguardActionEmbed(
            this.player.game.guild,
            this.player.game.players.alive)
        );
    }

    action(command: Command): boolean {
        if (command.type === RecognisedCommands.Protect) {
            // Player cannot make a target outside of the night phase.
            if (this.player.game.phase !== Phase.Night) {
                this.player.send(ActionTemplate.bodyguard.nonNightPhase());
                return false;
            }
            // Player did not have a target.
            if (command.target === undefined && command.args === "") {
                this.player.send(ActionTemplate.bodyguard.noTarget());
                return false;
            }
            // Could not find that target.
            if (command.target === undefined) {
                this.player.send(ActionTemplate.bodyguard.noTargetFound(command.args));
                return false;
            }
            // Multiple players were found under that name.
            if (command.target instanceof Array) {
                this.player.send(ActionTemplate.bodyguard.multipleTargetsFound(command.target, command.args));
                return false;
            }
            // Target is dead.
            if (!command.target.alive) {
                this.player.send(ActionTemplate.bodyguard.deadTarget(command.target));
                return false;
            }

            // All is good!
            this.target = command.target;
            this.player.send(ActionTemplate.bodyguard.success(this.target));
            this.usedAction = true;
            return true;
        }

        // Not a command I understand, ignore it.
        return false;
    }
}
