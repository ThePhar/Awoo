import Role from "../interfaces/role";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import Teams from "../structs/teams";
import Phases from "../structs/phase";

export default class Witch implements Role {
    name = "Witch";
    pluralName = "Witches";
    appearance = "villager";
    team = Teams.Villagers;

    player: Player;
    getRoleMessage: () => unknown;
    getNightActionMessage: () => unknown;

    killing?: Player;
    saving = false;

    usedKillPotion = false;
    usedSavePotion = false;

    constructor(player: Player, getRoleMessage: () => unknown, getNightActionMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
        this.getNightActionMessage = getNightActionMessage;
    }

    resetChoices(): void {
        this.player.accusing = undefined;
    }

    actionHandler(command: Command): void {
        const game = this.player.game;
        const targetNameOrId = command.args.join(" ");

        // Do not allow these during the first night!
        if (game.day === 1) {
            return;
        }

        // Do not process actions from dead players or outside of the night phase.
        if (!this.player.alive || game.phase !== Phases.Night) {
            return;
        }

        // Target a player for inspection.
        if (command.type === RecognisedCommands.Kill && !this.usedKillPotion) {
            // No name specified in target.
            if (targetNameOrId === "") {
                this.player.send("Please enter a target.");
                return;
            }

            // Find a suitable target.
            const targets = game.getPlayers(targetNameOrId);

            // Multiple targets found.
            if (targets.length > 1) {
                this.player.send("Sorry, I found multiple players under that name. Please be more specific.");
                return;
            }

            // Get the first target.
            const target = targets[0];

            // No target found.
            if (!target) {
                this.player.send(`Sorry, I couldn't find a player by the name or id of \`${targetNameOrId}\``);
                return;
            }
            // Target has no role.
            if (!target.role) {
                throw new Error("No role is specified for this player!");
            }
            // Player is attempting to target themselves.
            if (target.id === this.player.id) {
                this.player.send("You cannot kill yourself! Life is good!");
                return;
            }

            // Set our state.
            this.killing = target;
            this.usedKillPotion = true;
            this.player.send(`You have used your potion of death on ${target.name}. They will die tomorrow.`);
        } else if (command.type === RecognisedCommands.Save) {
            // Set our state.
            this.saving = true;
            this.usedSavePotion = true;
            this.player.send(
                `You have used your potion of life. Whoever is targeted by the werewolves will not die tomorrow.`,
            );
        }
    }
}
