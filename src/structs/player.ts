import PlayerData from "../interfaces/player-data";
import Role from "../interfaces/role";
import Game from "./game";
import getMostDuplicates from "../util/duplicate";
import Phases from "./phases";
import RecognisedCommands from "./recognised-commands";
import Command from "./command";
import Mayor from "../roles/mayor";

export default class Player {
    name: string;
    id: string;
    game: Game;
    alive: boolean;
    role?: Role;
    accusing?: Player;

    send: Function;

    constructor(data: PlayerData) {
        this.name = data.name;
        this.id = data.id;
        this.game = data.game;
        this.role = data.role;

        // Assign implementation specific functions.
        this.send = data.send;

        // Generate default values if not already specified.
        this.alive = data.alive === undefined ? true : data.alive;
    }

    accuse(command: Command): void {
        const game = this.game;
        const targetNameOrId = command.args.join(" ");

        // Do not process accusations from dead players.
        if (!this.alive) {
            return;
        }

        // Target a player for accusation (day only!).
        if (command.type === RecognisedCommands.Accuse && game.phase === Phases.Day) {
            // No name specified after the command.
            if (targetNameOrId === "") {
                game.send("Please enter a target.");
                return;
            }

            // Find a suitable target.
            const targets = game.getPlayers(targetNameOrId);
            // If multiple targets found, do not continue.
            if (targets.length > 1) {
                game.send("Sorry, I found multiple players under that name. Please be more specific.");
                return;
            }

            // Get the first target.
            const target = targets[0];

            // No target found.
            if (!target) {
                game.send(`Sorry, I couldn't find a player by the name or id of \`${targetNameOrId}\``);
                return;
            }
            // Player is attempting to target themselves.
            if (target.id === this.id) {
                game.send("You cannot accuse yourself.");
                return;
            }
            // Target is dead.
            if (!target.alive) {
                game.send("You cannot accuse an eliminated player.");
                return;
            }
            // Attempting to target a player already targeted.
            if (this.accusing && target.id === this.accusing.id) {
                game.send(`You are already accusing ${target.name}.`);
                return;
            }

            game.send(`${this.name} has voted to lynch ${target.name}.`);
            this.accusing = target;
        }
    }
    sendRole(): void {
        if (this.role) {
            this.send(this.role.getRoleMessage());
        }
    }
    sendNightActions(): void {
        if (this.role && this.role.getNightActionMessage) {
            this.send(this.role.getNightActionMessage());
        }
    }

    static getLynchElimination(players: Array<Player>): Player | undefined {
        // Find the accused player of each villager.
        const mayorVotes: Array<Player | undefined> = [];
        let accusedPlayers = players.map(player => {
            // Count the mayor twice.
            if (player.role && player.role instanceof Mayor && player.accusing) {
                mayorVotes.push(player.accusing);
            }
            return player.accusing;
        });

        accusedPlayers = accusedPlayers.concat(mayorVotes);
        accusedPlayers = accusedPlayers.filter(accused => accused !== undefined) as Array<Player>;

        // Find which accused player was targeted the most.
        if (accusedPlayers.length > 0) {
            const most = getMostDuplicates(accusedPlayers as Array<Player>);

            // If only 1 accused had the most, return that player. Otherwise, do not return a player.
            if (most.length === 1) {
                return most[0];
            }
        }
    }
}
