import Role from "../interfaces/role";
import { RichEmbed } from "discord.js";
import rs from "../strings/role-strings";
import Colors from "../structs/colors";
import s from "../strings";
import NightActiveRole from "../interfaces/night-active-role";
import { GameState } from "../test/old/store/game.test";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import {
    findAllAliveVillagers,
    findAllLivingWerewolves,
    findAllWerewolves,
    findPlayerByName,
} from "../selectors/find-players";
import { targetPlayer } from "../actions/players";

export default class Werewolf implements Role, NightActiveRole {
    name = "Werewolf";
    appearance = "werewolf";
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    embed(): RichEmbed {
        const gameState = this.player.game.getState() as GameState;

        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(rs.werewolf.description)
            .setColor(Colors.WerewolfRed)
            .setThumbnail(rs.werewolf.imageUrl)
            .addField(s.fieldNames.teamAndWinConditions, rs.werewolf.winCondition)
            .addField(s.fieldNames.dayCommands, s.villager.day, true)
            .addField(s.fieldNames.nightCommands, s.werewolf.night, true)
            .addField(s.fieldNames.werewolves, findAllWerewolves(gameState.players)) // TODO: Implement werewolves selector.
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date."); // TODO: Change help placeholder
    }

    nightAction(command: Command): void {
        const gameState = this.player.game.getState() as GameState;

        if (command.type === RecognisedCommands.Target) {
            // Find the target for the killing.
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
                // Target is dead.
                else if (!target.isAlive) {
                    this.player.client.send(`You cannot target eliminated players ${this.player.client}.`);
                    return;
                }
                // Player is changing their target... to the same target.
                else if (this.player.target && target.client.id === this.player.target.client.id) {
                    this.player.client.send(`You are already targeting ${this.player.target.client}.`);
                    return;
                }
                // All is good!
                else {
                    const werewolves = findAllLivingWerewolves(gameState.players);
                    werewolves.forEach(werewolf => {
                        // Werewolf already targeted someone.
                        if (werewolf.target) {
                            werewolf.client.send(
                                `${werewolf.client} has changed their target from ${werewolf.target.client} to ${target.client}.`,
                            );
                        }
                        // First target.
                        else {
                            werewolf.client.send(`${werewolf.client} has targeted ${target.client}.`);
                        }
                    });

                    this.player.game.dispatch(targetPlayer(this.player, target));
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
        const villagers = findAllAliveVillagers(gameState.players);

        return new RichEmbed()
            .setTitle(`On The Dinner Menu`)
            .setDescription(rs.werewolf.nightActionDescription)
            .setColor(Colors.WerewolfRed)
            .setThumbnail(rs.werewolf.imageUrl)
            .addField(s.fieldNames.availableTargets, villagers.length > 0 ? villagers : "**None**")
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date."); // TODO: Change help placeholder
    }
}
