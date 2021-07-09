import * as Discord from "discord.js";

import { AwooClient } from "../structs/client";
import { Command } from "./base";
import { Game } from "../structs/game";

import dedent from "dedent";
import { StartEmbed } from "../embeds/start";

export default class Create extends Command {
    public readonly name = "create";
    public readonly description = "Start a new game of Werewolf in this channel.";

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

        // Only server admins can create games. (for now)
        if (!Command.isAdministrator(member)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, only server administrators can create new games.`,
                ephemeral: true,
            });
        }

        // Do not create a new game if one already exists.
        if (client.games.has(channel.id)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, there is already a game set up for this channel.`,
                ephemeral: true,
            });
        }

        // Check to ensure our client has the appropriate permissions.
        if (!client.hasRequiredPermissions(channel)) {
            const content = dedent`
                Sorry, but I need a minimum level of permissions to start and manage a game in this channel.
      
                Required Permissions:
                \`\`\`
                    Manage Channel
                    Manage Permissions
                    Read Messages
                    Send Messages
                    Manage Messages
                    Read Message History
                    Use External Emojis
                \`\`\`
            `;

            return interaction.reply({
                content,
                ephemeral: true,
            });
        }

        // All is good!
        const game = new Game(channel);
        client.games.set(game.id, game);

        return interaction.reply({ embeds: [new StartEmbed(game)] });
    };
}
