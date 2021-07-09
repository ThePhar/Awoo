import * as Discord from "discord.js";

import { AwooClient } from "../structs/client";
import { Command } from "./base";

export default class Delete extends Command {
    public readonly name = "delete";
    public readonly description = "Delete an existing game of Werewolf from this channel.";

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

        // Only server admins can delete games. (for now)
        if (!Command.isAdministrator(member)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, only server administrators can delete games.`,
                ephemeral: true,
            });
        }

        // Do not delete a new game if one already exists.
        if (!client.games.has(channel.id)) {
            return interaction.reply({
                content: `Sorry ${interaction.member}, there are no games to delete in this channel.`,
                ephemeral: true,
            });
        }

        // All is good!
        client.games.delete(channel.id);
        return interaction.reply("The administrator has deleted this game. The game is over.");
    };
}
