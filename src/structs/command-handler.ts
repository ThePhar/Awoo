import RecognisedCommands from "./recognised-commands";
import Command from "./command";
import { initializeGame } from "../store/game";
import { GameState } from "../test/store/game.test";
import Phases from "./phases";
import { sprintf } from "sprintf-js";
import Player from "./player";
import { addPlayer, removePlayer } from "../actions/players";
import { RichEmbed } from "discord.js";
import { findPlayer } from "../selectors/find-players";

type GameStore = ReturnType<typeof initializeGame>;

export default class CommandHandler {
    static execute(command: Command, game: GameStore): void {
        switch (command.type) {
            case RecognisedCommands.Join:
                CommandHandler.processJoinCommand(command, game);
                break;
            case RecognisedCommands.Leave:
                CommandHandler.processLeaveCommand(command, game);
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
            command.executor.send(
                sprintf(
                    "Sorry %s, I can't add players via DM. Please send the %s command in the game channel of the server you wish to join.",
                    command.executor.toString(),
                    Command.getCode(command.type, command.args),
                ),
            );
            return;
        }

        // Do not allow this command outside when a game is in progress.
        if (state.meta.phase !== Phases.WaitingForPlayers) {
            await command.message.delete();
            return;
        }

        // Create a player object for this user.
        const player = new Player(command.executor);

        // Check if player already exists.
        if (findPlayer(player.client.id, state.players)) {
            state.meta.discussionChannel.send(`You're already signed up ${player.client}.`);
            return;
        }

        // Attempt to message them via direct message and if successful, add player via action.
        try {
            await player.client.send(`Hey, ${player.client} you have joined the upcoming game.`); // TODO: Add guild to message.

            state.meta.discussionChannel.send(`${player.client} has signed up for the next game!`);
            game.dispatch(addPlayer(player));
        } catch (error) {
            // TODO: Create an image for this, showing them what to do.
            const embed = new RichEmbed();

            command.message.channel.send(
                `Sorry ${command.executor}, but you need to enable DMs from users in the same server as you to join the game. Otherwise, I can't send you your role!`,
            );

            embed.setTitle("How to Allow DMs From Users In This Server").setImage(`https://i.imgur.com/YP7WVHz.png`); // TODO: Change location of image.

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
            command.executor.send(
                sprintf(
                    "Sorry %s, I can't remove players via DM. Please send the %s command in the game channel of the server you wish to leave.",
                    command.executor.toString(),
                    Command.getCode(command.type, command.args),
                ),
            );
            return;
        }

        // Do not allow this command outside when a game is in progress.
        if (state.meta.phase !== Phases.WaitingForPlayers) {
            await command.message.delete();
            return;
        }

        // Create a player object for this user.
        const player = findPlayer(command.executor.id, state.players);

        // Check if player doesn't exist.
        if (!player) {
            state.meta.discussionChannel.send(`You are not signed up ${command.executor}.`);
            return;
        }

        // Remove the player from the game.
        state.meta.discussionChannel.send(`${player.client} has left the next game!`);
        game.dispatch(removePlayer(player));
    }
}
