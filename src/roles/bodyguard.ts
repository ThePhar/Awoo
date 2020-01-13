import Role from "../interfaces/role";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import Teams from "../structs/teams";
import Phases from "../structs/phases";

export default class Bodyguard implements Role {
    name = "Bodyguard";
    pluralName = "Bodyguards";
    appearance = "villager";
    team = Teams.Villagers;

    player: Player;
    getRoleMessage: () => unknown;
    getNightActionMessage: () => unknown;

    protecting?: Player;

    constructor(player: Player, getRoleMessage: () => unknown, getNightActionMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
        this.getNightActionMessage = getNightActionMessage;
    }

    resetChoices(): void {
        this.player.accusing = undefined;
        this.protecting = undefined;
    }

    actionHandler(command: Command): void {
        const game = this.player.game;
        const targetNameOrId = command.args.join(" ");

        // Do not process actions from dead players or outside of the night phase.
        if (!this.player.alive || game.phase !== Phases.Night) {
            return;
        }

        // Target a player for inspection.
        if (command.type === RecognisedCommands.Target) {
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

            // Set our state.
            this.protecting = target;
            this.player.send(`You are now protecting ${target.name}. They are safe from elimination tonight.`);
        }
    }
}
