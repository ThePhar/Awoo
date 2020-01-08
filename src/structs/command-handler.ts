import RecognisedCommands from "./recognised-commands";
import Command from "./command";
import { GameStore } from "../store/game";
import { GameState } from "../test/old/store/game.test";
import Phases from "./phases";
import { sprintf } from "sprintf-js";
import Player from "./player";
import { accusePlayer, addPlayer, removePlayer } from "../actions/players";
import { RichEmbed } from "discord.js";
import { findPlayer, findPlayerByName } from "../selectors/find-players";
import NightActiveRole from "../interfaces/night-active-role";

export default class CommandHandler {
    static execute(command: Command, game: GameStore): void {
        switch (command.type) {
            // Lobby commands.
            case RecognisedCommands.Join:
                CommandHandler.processJoinCommand(command, game);
                break;
            case RecognisedCommands.Leave:
                CommandHandler.processLeaveCommand(command, game);
                break;

            // Day commands.
            case RecognisedCommands.Accuse:
                CommandHandler.processAccuseCommand(command, game);
                break;

            // Night commands.
            case RecognisedCommands.Target:
                CommandHandler.processNightCommand(command, game);
                break;

            // Meta commands.
            case RecognisedCommands.Role:
                CommandHandler.processRoleCommand(command, game);
                break;
        }
    }

    private static async processJoinCommand(command: Command, game: GameStore): Promise<void> {
        const state = game.getState() as GameState;

        // Check for discussion channel existence.
        if (!state.meta.discussionChannel) {
            console.error("No discussion channel specified, returning");
            return;
        }

        // Do not accept join commands via DM.
        if (command.isDM) {
            const cmdString = Command.getCode(command.type, command.args);

            command.executor.send(
                `Sorry ${command.executor}, I can't add players via DM. ` +
                    `Please send the ${cmdString} command in the game channel of the server you wish to join.`,
            );
            return;
        }

        // Do not allow this command outside when a game is in progress.
        if (state.meta.phase !== Phases.WaitingForPlayers) {
            await command.message.delete();
            return;
        }

        // Create a player object for this user.
        const player = new Player(command.executor, game);

        // Check if player already exists.
        if (findPlayer(player.id, state.players)) {
            state.meta.discussionChannel.send(`You're already signed up ${player.user}.`);
            return;
        }

        // Attempt to message them via direct message and if successful, add player via action.
        try {
            await player.user.send(
                `Hey, ${player.user} you have joined the upcoming game in ${command.message.guild.name}.`,
            );

            state.meta.discussionChannel.send(`${player.user} has signed up for the next game!`);
            game.dispatch(addPlayer(player));
        } catch (error) {
            const embed = new RichEmbed()
                .setTitle("How to Allow DMs From Users For This Server")
                .setImage("https://i.imgur.com/YP7WVHz.png");

            command.message.channel.send(
                `Sorry ${command.executor}, but you need to enable DMs from users in the same server as you to join the game. Otherwise, I can't send you your role!`,
            );
            command.message.channel.send(embed);
        }
    }
    private static async processLeaveCommand(command: Command, game: GameStore): Promise<void> {
        const state = game.getState() as GameState;

        // Check for discussion channel existence.
        if (!state.meta.discussionChannel) {
            console.error("No discussion channel specified, returning");
            return;
        }

        // Do not accept join commands via DM.
        if (command.isDM) {
            const cmd = Command.getCode(command.type, command.args);

            command.executor.send(
                `Sorry ${command.executor}, I can't remove players via DM. Please send the ${cmd} command in the game channel of the server you wish to leave.`,
            );
            return;
        }

        // Do not allow this command outside when a game is in progress.
        if (state.meta.phase !== Phases.WaitingForPlayers) {
            await command.message.delete();
            return;
        }

        // Find the player object for this user.
        const player = findPlayer(command.executor.id, state.players);

        // Check if player doesn't exist.
        if (!player) {
            state.meta.discussionChannel.send(`You are not signed up ${command.executor}.`);
            return;
        }

        // Remove the player from the game.
        state.meta.discussionChannel.send(`${player.user} has left the next game!`);
        game.dispatch(removePlayer(player));
    }
    private static async processAccuseCommand(command: Command, game: GameStore): Promise<void> {
        const state = game.getState() as GameState;

        // Check for discussion channel existence.
        if (!state.meta.discussionChannel) {
            console.error("No discussion channel specified, returning");
            return;
        }

        // Do not accept accuse commands via DM.
        if (command.isDM) {
            const cmd = Command.getCode(command.type, command.args);

            command.executor.send(
                `Sorry ${command.executor}, I can't accuse players via DM. Please send the ${cmd} command in the game channel of the server you wish to accuse in.`,
            );
            return;
        }

        // Do not allow this command outside of Day Phase.
        if (state.meta.phase !== Phases.Day) {
            await command.message.delete();
            return;
        }

        // Find the player for this user.
        const player = findPlayer(command.executor.id, state.players);
        if (!player || !player.isAlive) {
            await command.message.delete();
            return;
        }

        // Find the target for this command.
        if (command.args.length !== 0) {
            const playerName = command.args.join(" ");

            // Find the target
            const target = findPlayerByName(playerName, state.players);

            // No target found.
            if (!target) {
                state.meta.discussionChannel.send(
                    `Sorry ${player.user}, but I cannot find a player by the name of \`${playerName}\``,
                );
                return;
            }

            // Target is the player making the command.
            else if (target.id === player.id) {
                state.meta.discussionChannel.send(`You cannot target yourself ${player.user}.`);
                return;
            }

            // Target is dead.
            else if (!target.isAlive) {
                state.meta.discussionChannel.send(`You cannot accuse eliminated players ${player.user}.`);
                return;
            }

            // All is good!
            else {
                // Changing their mind.
                if (player.accusing) {
                    state.meta.discussionChannel.send(`${player.user} has changed their accusation to ${target.user}.`);
                    game.dispatch(accusePlayer(player, target));
                    return;
                }

                // First time accuse.
                else {
                    state.meta.discussionChannel.send(`${player.user} has accused ${target.user}.`);
                    game.dispatch(accusePlayer(player, target));
                    return;
                }
            }
        }

        // No target args.
        else {
            state.meta.discussionChannel.send(
                `${player.user}, please enter a name to accuse a player. ` +
                    `Example: ${Command.getCode(RecognisedCommands.Accuse, ["name"])}.`,
            );
            return;
        }
    }
    private static async processNightCommand(command: Command, game: GameStore): Promise<void> {
        const state = game.getState() as GameState;

        // Only process night commands via DM.
        if (!command.isDM) {
            await command.message.delete();
            const cmd = Command.getCode(command.type, command.args);

            command.executor.send(
                `Sorry ${command.executor}, I can't process night commands in public. Please send the ${cmd} command in this DM channel for "security reasons."`,
            );
            return;
        }

        // Do not allow this command outside of Day Phase.
        if (state.meta.phase !== Phases.Night) {
            command.executor.send(`Sorry ${command.executor}, I can only process that command at night.`);
            return;
        }

        // Find the player for this user.
        const player = findPlayer(command.executor.id, state.players);
        if (!player || !player.isAlive) {
            command.executor.send(`Sorry ${command.executor}, only living players can send that command.`);
            return;
        }

        // Only process the night role if the player is night active.
        if ((player.role as NightActiveRole).nightAction) {
            const role = player.role as NightActiveRole;

            role.nightAction(command);
        } else {
            command.executor.send(`Sorry ${command.executor}, you don't have any night actions.`);
            return;
        }
    }
    private static async processRoleCommand(command: Command, game: GameStore): Promise<void> {
        const state = game.getState() as GameState;

        // Only allow this command outside of Waiting Phase.
        if (state.meta.phase === Phases.WaitingForPlayers) {
            command.executor.send(
                `Sorry ${command.executor}, I can't send roles out when the game hasn't even started!`,
            );
            return;
        }

        // Find the player for this user.
        const player = findPlayer(command.executor.id, state.players);
        if (!player) {
            command.executor.send(`Sorry ${command.executor}, only players have roles.`);
            return;
        }

        player.user.send(player.role.embed);
    }
}
