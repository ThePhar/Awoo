import * as Embeds from "../templates/embed-templates";

import Role               from "../interfaces/role";
import Team               from "../structs/team";
import Phase              from "../structs/phase";
import Player             from "../structs/player";
import Command            from "../structs/command";
import RoleTemplate       from "../templates/role-templates";
import ActionTemplate     from "../templates/action-templates";
import RecognisedCommands from "../structs/recognised-commands";

export default class Werewolf implements Role {
    readonly player: Player;

    readonly name       = RoleTemplate.werewolf.name;
    readonly pluralName = RoleTemplate.werewolf.pluralName;
    readonly appearance = RoleTemplate.werewolf.appearance;
    readonly team       = Team.Werewolves;

    usedAction = false;
    target?: Player;

    constructor(player: Player) {
        this.player = player;
    }

    sendRole(): void {
        this.player.send(Embeds.werewolfRoleEmbed(this.player.game.guild, this.player.game.players.aliveWerewolves));
    }

    sendActionReminder(): void {
        // Reset target.
        this.target = undefined;
        this.usedAction = false;

        // Do not send an action reminder on the first night.
        if (this.player.game.day === 1) return;

        this.player.send(Embeds.werewolfActionEmbed(this.player.game.guild, this.player.game.players.aliveVillagers));
    }

    action(command: Command): boolean {
        if (command.type === RecognisedCommands.Kill) {
            // Player cannot target others on the first night.
            if (this.player.game.phase === Phase.Night && this.player.game.day === 1) {
                this.player.send(ActionTemplate.werewolf.firstNight());
                return false;
            }
            // Player cannot make a target outside of the night phase.
            if (this.player.game.phase !== Phase.Night) {
                this.player.send(ActionTemplate.werewolf.nonNightPhase());
                return false;
            }
            // Player did not have a target.
            if (command.target === undefined && command.args === "") {
                this.player.send(ActionTemplate.werewolf.noTarget());
                return false;
            }
            // Could not find that target.
            if (command.target === undefined) {
                this.player.send(ActionTemplate.werewolf.noTargetFound(command.args));
                return false;
            }
            // Multiple players were found under that name.
            if (command.target instanceof Array) {
                this.player.send(ActionTemplate.werewolf.multipleTargetsFound(command.target, command.args));
                return false;
            }
            // Player targeting themselves.
            if (command.target.id === this.player.id) {
                this.player.send(ActionTemplate.werewolf.selfTarget());
                return false;
            }
            // Target is dead.
            if (!command.target.alive) {
                this.player.send(ActionTemplate.werewolf.deadTarget(command.target));
                return false;
            }
            // Player is attempting to target another werewolf.
            if (command.target.role instanceof Werewolf) {
                this.player.send(ActionTemplate.werewolf.werewolfTarget(command.target));
                return false;
            }

            // All is good!
            const target = command.target;
            const player = this.player;

            this.target = target;
            this.player.game.players.aliveWerewolves.forEach((werewolf) => {
                werewolf.send(ActionTemplate.werewolf.success(player, target));
            });
            this.usedAction = true;
            return true;
        }

        // Not a command I understand, ignore it.
        return false;
    }
}
