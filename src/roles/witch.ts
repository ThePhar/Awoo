import * as Embeds from "../templates/embed-templates";

import Role               from "../interfaces/role";
import Team               from "../structs/team";
import Phase              from "../structs/phase";
import Player             from "../structs/player";
import Command            from "../structs/command";
import RoleTemplate       from "../templates/role-templates";
import ActionTemplate     from "../templates/action-templates";
import RecognisedCommands from "../structs/recognised-commands";

export default class Witch implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.witch.name;
    readonly pluralName = RoleTemplate.witch.pluralName;
    readonly appearance = RoleTemplate.villager.appearance;
    readonly team       = Team.Villagers;

    usedAction = false;
    target?: Player;
    usedDeath = false;
    usedSave = false;
    saving = false;

    constructor(player: Player) {
        this.player = player;
    }

    sendRole(): void {
        this.player.send(Embeds.witchRoleEmbed(this.player.game.guild));
    }

    sendActionReminder(): void {
        this.usedAction = false;

        // Do not send an action reminder on the first night.
        if (this.player.game.day === 1) return;

        if (!this.usedDeath && !this.usedSave) {
            this.player.send(Embeds.witchActionEmbed(
                this.player.game.guild,
                this.player.game.players.alive,
                this.player,
                this)
            );
        }
    }

    action(command: Command): boolean {
        if (command.type === RecognisedCommands.Kill && !this.usedDeath) {
            // Player cannot use potion others on the first night.
            if (this.player.game.phase === Phase.Night && this.player.game.day === 1) {
                this.player.send(ActionTemplate.witch.firstNight());
                return false;
            }
            // Player cannot make a target outside of the night phase.
            if (this.player.game.phase !== Phase.Night) {
                this.player.send(ActionTemplate.witch.nonNightPhase());
                return false;
            }
            // Player did not have a target.
            if (command.target === undefined && command.args === "") {
                this.player.send(ActionTemplate.witch.noTarget());
                return false;
            }
            // Could not find that target.
            if (command.target === undefined) {
                this.player.send(ActionTemplate.witch.noTargetFound(command.args));
                return false;
            }
            // Multiple players were found under that name.
            if (command.target instanceof Array) {
                this.player.send(ActionTemplate.witch.multipleTargetsFound(command.target, command.args));
                return false;
            }
            // Player targeting themselves.
            if (command.target.id === this.player.id) {
                this.player.send(ActionTemplate.witch.selfTarget());
                return false;
            }
            // Target is dead.
            if (!command.target.alive) {
                this.player.send(ActionTemplate.witch.deadTarget(command.target));
                return false;
            }

            // All is good!
            this.target = command.target;
            this.player.send(ActionTemplate.witch.successKill(this.target));
            this.usedAction = true;
            return true;
        } else if (command.type === RecognisedCommands.Kill) {
            this.player.send("You have already used your death potion. You cannot use it again.");
            return false;
        } else if (command.type === RecognisedCommands.Save && !this.usedSave) {
            // Player cannot use potion others on the first night.
            if (this.player.game.phase === Phase.Night && this.player.game.day === 1) {
                this.player.send(ActionTemplate.witch.firstNight());
                return false;
            }
            // Player cannot save people outside of the night phase.
            if (this.player.game.phase !== Phase.Night) {
                this.player.send(ActionTemplate.witch.nonNightPhase());
                return false;
            }

            // All is good!
            this.saving = true;
            this.player.send(ActionTemplate.witch.successSave());
            this.usedAction = true;
            return true;
        } else if (command.type === RecognisedCommands.Save) {
            this.player.send("You have already used your life potion. You cannot use it again.");
            return false;
        }

        // Not a command I understand, ignore it.
        return false;
    }
}
