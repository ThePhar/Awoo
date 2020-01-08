import { RichEmbed } from "discord.js";
import randomItem from "random-item";
import Role from "../interfaces/role";
import NightActiveRole from "../interfaces/night-active-role";
import { START_DAY_PHASE } from "../interfaces/meta-actions";
import { GameState } from "../store/game";
import Colors from "../structs/colors";
import Command from "../structs/command";
import Player from "../structs/player";
import RecognisedCommands from "../structs/recognised-commands";
import RoleStrings from "../strings/roles";
import FieldStrings from "../strings/fields";
import Tips from "../strings/tips";
import { findAllPlayersButMe, findPlayerByName } from "../selectors/find-players";

export default class Seer implements Role, NightActiveRole {
    name = RoleStrings.seer.name;
    appearance = RoleStrings.villager.appearance;
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
            .setDescription(RoleStrings.seer.description)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(RoleStrings.seer.thumbnailUrl)
            .addField(FieldStrings.title.winCondition, RoleStrings.villager.winCondition)
            .addField(FieldStrings.title.dayCommands, RoleStrings.villager.dayCommands, true)
            .addField(FieldStrings.title.nightCommands, RoleStrings.seer.nightCommands, true)
            .setFooter(randomItem(Tips));
    }
    nightEmbed(): RichEmbed {
        const gameState = this.player.game.getState() as GameState;
        const players = findAllPlayersButMe(gameState.players, this.player);

        // Create a special list of players that includes their appearance if they've already been inspected.
        const villagers = this.formatArray(players);

        return new RichEmbed()
            .setTitle(RoleStrings.seer.nightName)
            .setDescription(RoleStrings.seer.nightDescription)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(RoleStrings.seer.thumbnailUrl)
            .addField(FieldStrings.title.availableTargets, villagers.length > 0 ? villagers : FieldStrings.none)
            .setFooter(randomItem(Tips));
    }

    nightAction(command: Command): void {
        const gameState = this.player.game.getState() as GameState;

        // Only allow this command if it's active.
        if (this.active && command.type === RecognisedCommands.Target) {
            if (command.args.length !== 0) {
                const playerName = command.args.join(" ");

                // Find the target
                const target = findPlayerByName(playerName, gameState.players);

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

                // Target has already been inspected.
                else if (this.inspected.find(p => p.id === target.id)) {
                    this.player.user.send(
                        `You already inspected this player. ${target.user} is a **${target.role.appearance}**.`,
                    );
                    return;
                }

                // All is good!
                else {
                    const embed = new RichEmbed()
                        .setColor(Colors.VillagerBlue)
                        .setDescription(`${target.user} is a **${(target.role as Role).appearance}**.`)
                        .setFooter(randomItem(Tips));

                    this.player.user.send(embed);

                    this.active = false;
                    this.inspected.push(target);
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

    private formatArray(players: Array<Player>): Array<string> {
        return players.map(player => {
            if (this.inspected.find(p => p.id === player.id)) {
                return player.toString() + ` (**${player.role.appearance}**)`;
            } else {
                return player.toString() + ` (**?**)`;
            }
        });
    }
}
