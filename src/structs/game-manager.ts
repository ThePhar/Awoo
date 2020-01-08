import { GameStore } from "../store/game";
import { GameState } from "../test/store/game.test";
import { Message, RichEmbed } from "discord.js";
import RecognisedCommands from "./recognised-commands";
import Command from "./command";
import Colors from "./colors";
import { ADD_PLAYER, REMOVE_PLAYER } from "../interfaces/players-actions";

export default class GameManager {
    game: GameStore;
    latestNotification?: Message | Array<Message>;

    constructor(game: GameStore) {
        this.game = game;
    }

    async startLobby(): Promise<void> {
        const state = this.game.getState() as GameState;

        // Check to ensure notification channel is defined.
        if (!state.meta.notificationChannel) {
            console.error("No notification channel specified, returning");
            return;
        }
        // Check to ensure discussion channel is defined.
        if (!state.meta.discussionChannel) {
            console.error("No discussion channel specified, returning");
            return;
        }

        // TODO: Write a separate file for this embed.
        const embed = new RichEmbed()
            .setTitle("New Werewolf Game - Waiting On Players")
            .setDescription(
                `Welcome to Awoo, an auto-moderated and real-time werewolf game for your Discord server, created by Zach Parks!\n\nIn order to begin a new game, we need a minimum of (6) players to join ${Command.getCode(
                    RecognisedCommands.Join,
                    [],
                )} in ${state.meta.discussionChannel}. For rules on how to play werewolf, type ${Command.getCode(
                    RecognisedCommands.Rules,
                    [],
                )} in ${state.meta.discussionChannel} or to me via DM.`,
            )
            .setColor(Colors.Informational)
            .addField("Signed Up Players", "**None**")
            .setFooter("TIP: PLACEHOLDER!");

        this.latestNotification = await state.meta.notificationChannel.send(embed);

        const stopLobby = this.game.subscribe(() => {
            const state = this.game.getState() as GameState;

            if (state.meta.lastActionFired.type === ADD_PLAYER || state.meta.lastActionFired.type === REMOVE_PLAYER) {
                const embed = new RichEmbed()
                    .setTitle("New Werewolf Game - Waiting On Players")
                    .setDescription(
                        `Welcome to Awoo, an auto-moderated and real-time werewolf game for your Discord server, created by Zach Parks!\n\nIn order to begin a new game, we need a minimum of (6) players to join ${Command.getCode(
                            RecognisedCommands.Join,
                            [],
                        )} in ${
                            state.meta.discussionChannel
                        }. For rules on how to play werewolf, type ${Command.getCode(
                            RecognisedCommands.Rules,
                            [],
                        )} in ${state.meta.discussionChannel} or to me via DM.`,
                    )
                    .setColor(Colors.Informational)
                    .addField("Signed Up Players", state.players.length > 0 ? state.players : "**None**")
                    .setFooter("TIP: PLACEHOLDER!");

                if (this.latestNotification) {
                    (this.latestNotification as Message).edit(embed);

                    // Check if minimum players have joined.
                    if (state.players.length >= 6) {
                        // TODO: Remove hardcoded value.
                        // TODO: Schedule game start.
                    }
                }
            }
        });
    }
    async startFirstNight(): Promise<void> {
        // TODO: Write first night logic. Should handle randomly assigning roles.
    }
    async startDay(): Promise<void> {
        // TODO: Write day logic. Should handle setting up channel for discussion.
    }
    async startNight(): Promise<void> {
        // TODO: Write night logic. Should disable discussion channel.
    }
}
