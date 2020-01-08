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

export default class Werewolf implements Role, NightActiveRole {
    name = RoleStrings.werewolf.name;
    appearance = RoleStrings.werewolf.appearance;
    player: Player;

    constructor(player: Player) {
        this.player = player;
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
                    // TODO: Write a nice embed for this.
                    const werewolves = Selector.findAllAliveWerewolves(gameState.players);
                    werewolves.forEach(werewolf => {
                        // Werewolf already targeted someone.
                        if (werewolf.target) {
                            werewolf.user.send(
                                `${werewolf.user} has changed their target from ${werewolf.target.user} to ${target.user}.`,
                            );
                        }
                        // First target.
                        else {
                            werewolf.user.send(`${werewolf.user} has targeted ${target.user}.`);
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
}
