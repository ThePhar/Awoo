import Role from "../interfaces/role";
import Player from "../structs/player";
import Teams from "../structs/teams";
import Command from "../structs/command";
import RecognisedCommands from "../structs/recognised-commands";

export default class Werewolf implements Role {
    name = "Werewolf";
    pluralName = "Werewolves";
    appearance = "werewolf";
    team = Teams.Werewolves;

    player: Player;
    getRoleMessage: () => unknown;
    getNightRoleMessage: () => unknown;

    target?: Player;

    constructor(player: Player, getRoleMessage: () => unknown, getNightRoleMessage: () => unknown) {
        this.player = player;
        this.getRoleMessage = getRoleMessage;
        this.getNightRoleMessage = getNightRoleMessage;
    }

    nightAction(command: Command): void {
        const game = this.player.game;
        const targetNameOrId = command.args.join(" ");

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
            // TODO: Write if multiple targets found.
            const [target] = game.getPlayers(targetNameOrId);

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
                if (player.role && player.role.name === "Werewolf") {
                    player.send(`${this.player.name} has targeted ${target.name}`);
                }
            });
            this.target = target;
        }
    }
}
