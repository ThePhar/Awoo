import * as Discord from "discord.js";
import * as Env from "dotenv";

import { AwooClient } from "./client";

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

// Log in and start our application.
// prettier-ignore
client
    .login(process.env["DISCORD_BOT_TOKEN"])
    .catch((err) => console.error(err));
