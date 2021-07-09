import * as Discord from "discord.js";

import { Command } from "./commands";

export class AwooClient extends Discord.Client {
    /**
     * Loads commands and updates each server's command list to match the commands directory.
     */
    public async loadCommands(): Promise<void> {
        // Change presence to announce we're loading commands.
        this.user?.setActivity("Loading commands...");

        // Load all of our commands and guilds.
        const commands = await Command.fetchCommands();
        const guilds = await this.guilds.fetch();

        // Iterate over each guild, and update their commands.
        for (const [id] of guilds) {
            const guild = await this.guilds.fetch(id);
            await Command.updateCommands(guild, commands);
        }

        // Create an event listener for command interactions.
        this.on("interaction", async (interaction) => {
            if (interaction instanceof Discord.CommandInteraction && interaction.command) {
                const command = commands.get(interaction.command.name);

                try {
                    await command?.handler(interaction);
                } catch (err) {
                    console.error(`Error while attempting to handle command: ${interaction.command.name}`);
                    console.error(err);
                }
            }
        });

        // We have finished, clear our activity.
        this.user?.setActivity();
    }
}
