import * as Discord from "discord.js";

import { AwooClient } from "../structs/client";
import { Command } from "./base";
import { Game } from "../structs/game";
import { Player } from "../structs/player";
import { StartEmbed } from "../embeds/start";

export default class Join extends Command {
    public readonly name = "join";
    public readonly description = "Join an upcoming game of Werewolf.";

    // Handler
    public readonly handler = async (interaction: Discord.CommandInteraction, client: AwooClient): Promise<void> => {
        const { member, channel } = interaction;

        // Do nothing if this interaction wasn't started by a guild member or in a text channel.
        if (!(member instanceof Discord.GuildMember) || !(channel instanceof Discord.TextChannel)) {
            return interaction.reply({
                content: "Something went wrong!",
                ephemeral: true,
            });
        }

        // You cannot join any games that are currently not in progress.
        if (!client.games.has(channel.id)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, there are no games to join in this channel.`,
                ephemeral: true,
            });
        }

        const game = client.games.get(channel.id) as Game;

        // A player cannot join a game multiple times.
        if (game.playerMap.has(member.id)) {
            return interaction.reply({
                content: `${interaction.member}, you are already signed up for the game!`,
                ephemeral: true,
            });
        }

        // A player cannot join a game in progress.
        if (game.active) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, but you cannot join a game in progress.`,
                ephemeral: true,
            });
        }

        // All is good!
        game.playerMap.set(member.id, new Player(member));

        // Check if we passed the threshold of minimum players. Schedule a game start.
        if (game.players.length >= 6 && !game.schedule) {
            // TODO: Do schedule logic.
            game.schedule = "TEST";

            await interaction.reply(`${member} has joined the game, and we now have the minimum required players!`);
        } else {
            await interaction.reply(`${member} has joined the next game.`);
        }

        // Update the start embed.
        game.embeds.get("start")?.edit({ embeds: [new StartEmbed(game)] });
    };
}
