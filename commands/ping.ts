import * as Discord from "discord.js";

import { Command } from "./base";

export default class Ping extends Command {
    public readonly name = "ping";
    public readonly description = "A simple ping command, suitable for testing!";

    // Handler
    public readonly handler = async (interaction: Discord.CommandInteraction): Promise<void> => {
        // Reply to the interaction, obviously.
        await interaction.reply({
            content: "Pong!",
            ephemeral: true,
        });
    };
}
