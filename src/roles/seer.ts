import Role from "../interfaces/role";
import { RichEmbed } from "discord.js";
import rs from "../strings/role-strings";
import Colors from "../structs/colors";
import s from "../strings";
import NightActive from "../interfaces/night-active-role";
import Player from "../structs/player";
import Command from "../structs/command";
import { GameState } from "../test/store/game.test";
import { START_DAY_PHASE } from "../interfaces/meta-actions";
import RecognisedCommands from "../structs/recognised-commands";
import { findAllPlayersButMe, findPlayerByName } from "../selectors/find-players";

export default class Seer implements Role, NightActive {
    name = "Seer";
    appearance = "villager";
    player: Player;

    active = true;
    inspected: Array<Player> = [];

    constructor(player: Player) {
        this.player = player;

        // Whenever the day phase begins, reset active night action.
        this.player.game.subscribe(() => {
            const gameState = this.player.game.getState() as GameState;

            if (gameState.meta.lastActionFired.type === START_DAY_PHASE) {
                this.active = true;
            }
        });
    }

    embed(): RichEmbed {
        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(rs.seer.description)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(rs.seer.imageUrl)
            .addField(s.fieldNames.teamAndWinConditions, rs.villager.winCondition)
            .addField(s.fieldNames.dayCommands, s.villager.day, true)
            .addField(s.fieldNames.nightCommands, s.seer.night, true)
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date."); // TODO: Replace with help text
    }

    nightAction(command: Command): void {
        const gameState = this.player.game.getState() as GameState;

        if (this.active && command.type === RecognisedCommands.Target) {
            // Find the target for inspecting.
            if (command.args.length !== 0) {
                const playerName = command.args.join(" ");

                // Find the target
                const target = findPlayerByName(playerName, gameState.players);

                // No target found.
                if (!target) {
                    this.player.client.send(
                        `Sorry ${this.player.client}, but I cannot find a player by the name of \`${playerName}\``,
                    );
                    return;
                }
                // Target is the player making the command.
                else if (target.client.id === this.player.client.id) {
                    this.player.client.send(`You cannot target yourself ${this.player.client}.`);
                    return;
                }
                // Target has already been inspected.
                else if (this.inspected.find(p => p.client.id === target.client.id)) {
                    this.player.client.send(
                        `You already inspected this player. ${target.client} is a **${
                            (target.role as Role).appearance
                        }**.`,
                    );
                    return;
                }
                // All is good!
                else {
                    // TODO: Write a nice embed for this.
                    this.player.client.send(`${target.client} is a **${(target.role as Role).appearance}**.`);

                    this.active = false;
                    this.inspected.push(target);
                    return;
                }
            } else {
                this.player.client.send(
                    `${this.player.client}, please enter a name to target a player. ` +
                        `Example: ${Command.getCode(RecognisedCommands.Target, ["name/mention"])}.`,
                );
                return;
            }
        }
    }
    nightEmbed(): RichEmbed {
        const gameState = this.player.game.getState() as GameState;
        const players = findAllPlayersButMe(gameState.players, this.player);

        // Create a special list of players that includes their appearance if they've already been inspected.
        const villagers: Array<string> = players.map(player => {
            if (this.inspected.find(p => p.client.id === player.client.id)) {
                return player.toString() + ` (**${(player.role as Role).appearance}**)`;
            } else {
                return player.toString() + ` (**?**)`;
            }
        });

        return new RichEmbed()
            .setTitle(`Look Into The Crystal Ball`)
            .setDescription(rs.seer.nightActionDescription)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(rs.seer.imageUrl)
            .addField(s.fieldNames.availableTargets, villagers.length > 0 ? villagers : "**None**")
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date."); // TODO: Change help placeholder
    }
}
