import * as Discord from "discord.js";
import * as Env from "dotenv";

import { AwooClient } from "./client";

/**
 * Main entry point for this application.
 */
async function main() {
    // Load any environment variables that we may need for this project.
    const result = Env.config();
    if (result.error) {
        throw result.error;
    }

    // Instantiate our client with the required intents.
    const client = new AwooClient({
        intents: [
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_BANS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
        ],
    });

    // Login and initialize our bot.
    await client.login(process.env["DISCORD_BOT_TOKEN"]);
    await client.loadRoles();
    await client.loadCommands();
}

void main();
