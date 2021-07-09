import * as Discord from "discord.js";

import { Command } from "../commands";
import { Game } from "./game";
import { Role } from "../roles";

import util from "util";

export class AwooClient extends Discord.Client {
    public roles: Map<string, Role> = new Map();
    public games: Map<string, Game> = new Map();

    /**
     * Loads a list of all roles that are currently supported by this bot.
     */
    public async loadRoles(): Promise<void> {
        // Change presence to announce we're loading roles.
        this.user?.setActivity("Loading roles...");

        // Load all of our roles.
        this.roles = await Role.fetchRoles();

        // We have finished, clear our activity.
        this.user?.setActivity();
    }

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
        this.on("interactionCreate", async (interaction) => {
            if (interaction instanceof Discord.CommandInteraction && interaction.command) {
                const command = commands.get(interaction.command.name);

                try {
                    await command?.handler(interaction, this);
                } catch (err) {
                    console.error(`Error while attempting to handle command: ${interaction.command.name}`);
                    console.error(err);
                }
            }
        });

        // We have finished, clear our activity.
        this.user?.setActivity();
    }

    /**
     * Checks if this bot has the required permissions in a given channel to run a game of Werewolf.
     * @param channel The channel to check permissions in.
     */
    public hasRequiredPermissions(channel: Discord.TextChannel): boolean {
        const required: Discord.PermissionResolvable = [
            "MANAGE_CHANNELS",
            "EMBED_LINKS",
            "SEND_MESSAGES",
            "MANAGE_ROLES",
            "READ_MESSAGE_HISTORY",
            "ADD_REACTIONS",
            "MANAGE_MESSAGES",
            "USE_EXTERNAL_EMOJIS",
        ];

        const permissions = channel.permissionsFor(this.user as Discord.ClientUser);
        return !!permissions && (permissions.has("ADMINISTRATOR") || permissions.has(required));
    }

    // TODO: Remove these debug commands.
    public printGamesInterval(interval: number) {
        setInterval(() => {
            console.clear();

            for (const game of this.games.values()) {
                console.log(`GAME     ${game.id}`);
                console.log(`SCHEDULE ${game.schedule?.nextInvocation().toISOString()}`);
                console.log(`PHASE    ${game.phase}`);
                console.log(`DAY      ${game.day}`);
                console.log(`ACTIVE   ${game.active}`);

                for (const player of game.players) {
                    console.log(`\nPLAYER ${player.id} (${player.member.displayName})`);
                    console.log(`ALIVE  ${player.alive}`);
                    console.log(
                        `VOTE   ${player.vote.type} ${player.vote.voter.member.displayName} > ${player.vote.target.member.displayName}`,
                    );
                    console.log(
                        `ROLE =====\n${util.inspect(player.role, {
                            showHidden: false,
                            depth: null,
                            colors: true,
                        })}\n`,
                    );
                }
            }
        }, interval);
    }
}
