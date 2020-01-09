import { RichEmbed } from "discord.js";
import randomItem from "random-item";
import Role from "../interfaces/role";
import NightActiveRole from "../interfaces/night-active-role";
import { GameState } from "../store/game";
import Colors from "../structs/colors";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import { targetPlayer } from "../actions/players";
import FieldStrings from "../strings/fields";
import RoleStrings from "../strings/roles";
import Tips from "../strings/tips";
import * as Selector from "../selectors/find-players";
import { findAllWerewolves } from "../selectors/find-players";
import { START_DAY_PHASE } from "../interfaces/meta-actions";
import getMostDuplicates from "../util/duplicate";
import Elimination from "../structs/elimination";
import EliminationCause from "../structs/elimination-cause";

export default class Werewolf implements Role, NightActiveRole {
    name = RoleStrings.werewolf.name;
    appearance = RoleStrings.werewolf.appearance;
    player: Player;

    constructor(player: Player) {
        this.player = player;

        this.player.game.subscribe(() => {
            const state = this.player.game.getState() as GameState;

            if (state.meta.lastActionFired.type === START_DAY_PHASE) {
                this.player.target = null;
            }
        });
    }

    embed(): RichEmbed {
        const gameState = this.player.game.getState() as GameState;

        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(RoleStrings.werewolf.description)
            .setColor(Colors.WerewolfRed)
            .setThumbnail(RoleStrings.werewolf.thumbnailUrl)
            .addField(FieldStrings.title.winCondition, RoleStrings.werewolf.winCondition)
            .addField(FieldStrings.title.dayCommands, RoleStrings.villager.dayCommands, true)
            .addField(FieldStrings.title.nightCommands, RoleStrings.werewolf.nightCommands, true)
            .addField(FieldStrings.title.werewolves, Selector.findAllWerewolves(gameState.players))
            .setFooter(randomItem(Tips));
    }
    nightEmbed(): RichEmbed {
        const gameState = this.player.game.getState() as GameState;

        // Send a special embed for the first night.
        if (gameState.meta.day === 1) {
            return new RichEmbed()
                .setTitle("Not Hungry... Yet.")
                .setDescription(
                    "You are not allowed to eliminate players on the first night. Instead just learn who your werewolf companions are.",
                )
                .setColor(Colors.WerewolfRed)
                .setThumbnail(RoleStrings.werewolf.thumbnailUrl)
                .setFooter(randomItem(Tips));
        }

        const villagers = Selector.findAllAliveVillagers(gameState.players);

        return new RichEmbed()
            .setTitle(RoleStrings.werewolf.nightName)
            .setDescription(RoleStrings.werewolf.nightDescription)
            .setColor(Colors.WerewolfRed)
            .setThumbnail(RoleStrings.werewolf.thumbnailUrl)
            .addField(FieldStrings.title.availableTargets, villagers.length > 0 ? villagers : FieldStrings.none)
            .setFooter(randomItem(Tips));
    }

    nightAction(command: Command): void {
        const gameState = this.player.game.getState() as GameState;

        // Do not allow eliminations on the first night.
        if (gameState.meta.day === 1) return;

        // Find a target to kill.
        if (command.type === RecognisedCommands.Target) {
            if (command.args.length !== 0) {
                const playerName = command.args.join(" ");

                // Find the target
                const target = Selector.findPlayerByName(playerName, gameState.players);

                // No target found.
                if (!target) {
                    this.player.user.send(
                        `Sorry ${this.player.user}, but I cannot find a player by the name of \`${playerName}\``,
                    );
                    return;
                }

                // Target is the player making the command.
                else if (target.id === this.player.id) {
                    this.player.user.send(`You cannot target yourself ${this.player.user}.`);
                    return;
                }

                // Target is dead.
                else if (!target.isAlive) {
                    this.player.user.send(`You cannot target eliminated players ${this.player.user}.`);
                    return;
                }

                // Player is changing their target... to the same target.
                else if (this.player.target && target.id === this.player.target.id) {
                    this.player.user.send(`You are already targeting ${this.player.target.user}.`);
                    return;
                }

                // All is good!
                else {
                    const embed = new RichEmbed().setColor(Colors.WerewolfRed).setFooter(randomItem(Tips));

                    const werewolves = Selector.findAllAliveWerewolves(gameState.players);
                    werewolves.forEach(werewolf => {
                        // Werewolf already targeted someone.
                        if (werewolf.target) {
                            embed.setDescription(
                                `${werewolf.user} has changed their target from ${werewolf.target.user} to ${target.user}.`,
                            );
                            werewolf.user.send(embed);
                        }
                        // First target.
                        else {
                            embed.setDescription(`${werewolf.user} has targeted ${target.user}.`);
                            werewolf.user.send(embed);
                        }
                    });

                    this.player.game.dispatch(targetPlayer(this.player, target));
                    return;
                }
            }

            // The user inputted no target.
            else {
                this.player.user.send(
                    `${this.player.user}, please enter a name to target a player. ` +
                        `Example: ${Command.getCode(RecognisedCommands.Target, ["name"])}.`,
                );
                return;
            }
        }
    }

    static getElimination(state: GameState): Elimination | undefined {
        const eliminate = Werewolf.getTarget(state.players);
        if (eliminate) {
            return new Elimination(eliminate, Werewolf.eliminationEmbed(eliminate), EliminationCause.Werewolf);
        }
    }

    private static eliminationEmbed(player: Player): RichEmbed {
        return (
            new RichEmbed()
                .setTitle(`${player.user} Has Been Torn To Shreds`)
                .setDescription(
                    `> “The sounds of howling drown out the screams of ${player.user} as they meet a gruesome fate.”\n\n${player.user} has been eliminated from the game. Rest in ~~pieces~~ peace.`,
                )
                .setColor(Colors.WerewolfRed)
                // TODO: Create thumbnail. Maybe an image?
                .setFooter(randomItem(Tips))
        );
    }
    private static getTarget(players: Array<Player>): Player | undefined {
        const targets = findAllWerewolves(players)
            .filter(werewolf => werewolf.target)
            .map(werewolf => werewolf.target as Player);

        // Only select a player for elimination if there's clear winner.
        const mostTargeted = getMostDuplicates(targets);
        if (mostTargeted.length !== 1) {
            return undefined;
        }

        return mostTargeted[0];
    }
}
