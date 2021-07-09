import * as Discord from "discord.js";

import { AwooClient } from "../structs/client";
import { Command } from "./base";
import { Game } from "../structs/game";
import { Phase } from "../constants/phase";

export default class NextPhase extends Command {
    public readonly name = "nextphase";
    public readonly description = "Start the next phase, manually.";

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

        // Only server admins can force games to go to next phase.. (for now)
        if (!Command.isAdministrator(member)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, only server administrators can force the phase to change.`,
                ephemeral: true,
            });
        }

        // Do not force a phase change if one game doesn't exist.
        if (!client.games.has(channel.id)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, there are no games in this channel.`,
                ephemeral: true,
            });
        }

        const game = client.games.get(channel.id) as Game;

        // All is good!
        if (!game.active) {
            await game.startNewGame();
        } else if (game.phase === Phase.Night) {
            // await game.startDayPhase();
        } else {
            // await game.startNightPhase();
        }

        await interaction.reply({
            content: "Started the next phase.",
            ephemeral: true,
        });
    };
}
