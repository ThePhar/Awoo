import Role from "../interfaces/role";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import Teams from "../structs/teams";

export default class Hunter implements Role {
    name = "Hunter";
    pluralName = "Hunters";
    appearance = "villager";
    team = Teams.Villagers;

    player: Player;
    getRoleMessage: () => unknown;
    getNightActionMessage: () => unknown;

    target?: Player;
    shot = false;

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

        // Do not process actions from dead players.
        if (!this.player.alive) {
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
            // Player is attempting to target themselves.
            if (target.id === this.player.id) {
                this.player.send("You cannot target yourself.");
                return;
            }

            // Set our state.
            this.target = target;
            this.player.send(`You are now targeting ${target.name}. If you die, they will die as well.`);
        }
    }
}
