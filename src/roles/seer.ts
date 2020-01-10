import Role from "../interfaces/role";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import Teams from "../structs/teams";

export default class Seer implements Role {
    name = "Seer";
    pluralName = "Seers";
    appearance = "villager";
    team = Teams.Villagers;

    player: Player;
    getRoleMessage: () => unknown;
    getNightRoleMessage: () => unknown;

    active = true;
    inspected: Array<Player> = [];

    constructor(player: Player, getRoleMessage: () => unknown, getNightRoleMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
        this.getNightRoleMessage = getNightRoleMessage;
    }

    nightAction(command: Command): void {
        const game = this.player.game;
        const targetNameOrId = command.args.join(" ");

        // Target a player for inspection.
        if (command.type === RecognisedCommands.Target) {
            // No name specified in target.
            if (targetNameOrId === "") {
                this.player.send("Please enter a target.");
                return;
            }

            // Find a suitable target.
            // TODO: Write if multiple targets found.
            const [target] = game.getPlayers(targetNameOrId);

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
                this.player.send("You cannot inspect yourself.");
                return;
            }
            // Attempting to target a player already inspected.
            const inspected = this.inspected.find(p => p.id === target.id);
            if (inspected) {
                this.player.send(
                    `You have already inspected ${target.name} before. They are a ${target.role.appearance}.`,
                );
                return;
            }

            // Set our state.
            this.active = false;
            this.inspected.push(target);
            this.player.send(`You look into ${target.name}'s true self. They are a ${target.role.appearance}.`);
        }
    }
}
