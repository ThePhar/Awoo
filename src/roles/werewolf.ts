import Role from "../interfaces/role";
import Player from "../structs/player";
import Teams from "../structs/teams";
import Command from "../structs/command";
import RecognisedCommands from "../structs/recognised-commands";
import Phases from "../structs/phases";
import getMostDuplicates from "../util/duplicate";

export default class Werewolf implements Role {
    name = "Werewolf";
    pluralName = "Werewolves";
    appearance = "werewolf";
    team = Teams.Werewolves;

    player: Player;
    getRoleMessage: () => unknown;
    getNightActionMessage: () => unknown;

    target?: Player;

    constructor(player: Player, getRoleMessage: () => unknown, getNightActionMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
        this.getNightActionMessage = getNightActionMessage;
    }

    resetChoices(): void {
        this.player.accusing = undefined;
        this.target = undefined;
    }

    actionHandler(command: Command): void {
        const game = this.player.game;
        const targetNameOrId = command.args.join(" ");

        // Do not process actions from dead players or outside of the night phase.
        if (!this.player.alive || game.phase !== Phases.Night) {
            return;
        }

        // Target a player for elimination.
        if (command.type === RecognisedCommands.Target) {
            // Do not allow targeting during the first night.
            if (game.day === 1) {
                this.player.send("You cannot target a player during the first night.");
                return;
            }
            // No name specified after the command.
            if (targetNameOrId === "") {
                this.player.send("Please enter a target.");
                return;
            }

            // Find a suitable target.
            const targets = game.getPlayers(targetNameOrId);
            // If multiple targets found, do not continue.
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
            // Player is attempting to target themselves.
            if (target.id === this.player.id) {
                this.player.send("You cannot target yourself.");
                return;
            }
            // Target is dead.
            if (!target.alive) {
                this.player.send("You cannot target an eliminated player.");
                return;
            }
            // Target is a werewolf.
            if (target.role instanceof Werewolf) {
                this.player.send("You cannot target another werewolf.");
                return;
            }
            // Attempting to target a player already targeted.
            if (this.target && target.id === this.target.id) {
                this.player.send(`You are already targeting ${target.name}.`);
                return;
            }

            // Notify all werewolves and set the target.
            game.players.forEach(player => {
                if (player.alive && player.role && player.role.name === "Werewolf") {
                    player.send(`${this.player.name} has targeted ${target.name}`);
                }
            });
            this.target = target;
        }
    }

    static getWerewolfElimination(players: Array<Player>): Player | undefined {
        // Find the target of each werewolf.
        const targets = players
            .map(player => {
                if (player.role && player.role instanceof Werewolf) {
                    return player.role.target;
                }
            })
            .filter(target => target !== undefined) as Array<Player>;

        // Find which target was targeted the most.
        if (targets.length > 0) {
            const most = getMostDuplicates(targets);

            // If only 1 target had the most, return that target. Otherwise, do not return a target.
            if (most.length === 1) {
                return most[0];
            }
        }
    }
}
