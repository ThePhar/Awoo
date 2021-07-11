import * as Discord from "discord.js";
import * as Env from "dotenv";

import { AwooClient } from "./structs/client";
import { Team } from "./teams/base";
import { Villagers } from "./teams/villagers";
import { Werewolves } from "./teams/werewolves";
import { Vampires } from "./teams/vampires";
import { Tanner } from "./teams/tanner";
import { Cult } from "./teams/cult";
import { Hoodlum } from "./teams/hoodlum";
import { LoneWolf } from "./teams/lone-wolf";
import { Lovers } from "./teams/lovers";
import { Spectators } from "./teams/spectators";

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
    // await client.loadRoles();
    // await client.loadCommands();

    const channel = (await client.channels.fetch("785349255958495262")) as Discord.TextChannel;

    const teams: Team[] = [
        new Villagers(),
        new Werewolves(),
        new Vampires(),
        new Tanner(),
        new Cult(),
        new Hoodlum(),
        new LoneWolf(),
        new Lovers(),
        new Spectators(),
    ];

    for (const team of teams) {
        await channel?.send({ embeds: [team.embed()] });
    }

    // TODO: Remove this!
    // client.printGamesInterval(2000);
}

void main();
