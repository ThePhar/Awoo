import * as Discord from "discord.js";

import { AwooClient } from "../structs/client";

import equal from "deep-equal";
import fs from "fs";
import path from "path";

export abstract class Command implements Discord.ApplicationCommandData {
    // Required Properties
    public abstract readonly name: string;
    public abstract readonly description: string;
    public abstract readonly handler: (interaction: Discord.CommandInteraction, client: AwooClient) => Promise<void>;

    // Optional Properties
    public readonly defaultPermission?: boolean = true;
    public readonly options?: Discord.ApplicationCommandOptionData[] = [];

    /**
     * Checks the commands directory for any commands and return a map of active commands.
     */
    public static async fetchCommands(): Promise<Map<string, Command>> {
        const dir = __dirname;
        const commands: Map<string, Command> = new Map();

        // Fetch all file names in this directory that end with `.ts` or `.js`.
        const files = fs.readdirSync(dir).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        // Dynamically import each file and then add it to our commands map.
        for (const file of files) {
            const $class = await import(path.join(dir, file));

            // Attempt to add a command.
            try {
                const command: Command = new $class.default();
                commands.set(command.name, command);
            } catch {
                // Just ignore this class and move on...
            }
        }

        return commands;
    }

    /**
     * Updates a guild server with a list of commands.
     * @param guild The guild to update.
     * @param commands The command map to reference.
     */
    public static async updateCommands(guild: Discord.Guild, commands: Map<string, Command>): Promise<void> {
        const guildCommands = await guild.commands.fetch();
        const additionalCommands = new Map(commands);

        // Log this event for each server.
        console.log(`\nChecking commands in guild: ${guild.name}`);
        let [updated, created, deleted] = [0, 0, 0];

        // Let's check each command and ensure we don't need to delete or update any.
        for (const [id, guildCommand] of guildCommands) {
            const command = commands.get(guildCommand.name);

            // If a command is not in our commands map, it needs to be deleted.
            if (command === undefined) {
                console.log(`Deleting '${guildCommand.name}' from ${guild.name}...`);
                await guild.commands.delete(id);
                deleted++;
                continue;
            }

            // Delete this from our additional map, since we'll be adding any commands that not updated.
            additionalCommands.delete(guildCommand.name);

            // Update this command if it doesn't match our command options.
            if (
                command.description !== guildCommand.description ||
                command.defaultPermission !== guildCommand.defaultPermission ||
                !equal(guildCommand.options, command.options)
            ) {
                console.log(`Updating '${guildCommand.name}' in ${guild.name}...`);
                await guild.commands.edit(id, command);
                updated++;

                console.log(command.options);
                console.log(guildCommand.options);
            }
        }

        // Finally, we need to add any new commands that weren't in this server to this server.
        for (const command of additionalCommands.values()) {
            console.log(`Creating '${command.name}' in ${guild.name}...`);
            await guild.commands.create(command);
            created++;
        }

        console.log(`Finished commands for ${guild.name}.`);
        console.log(`DELETED: ${deleted} - UPDATED: ${updated} - CREATED: ${created}`);
    }

    /**
     * Checks if a particular guild member is an administrator.
     * @param member The member to check.
     */
    public static isAdministrator(member: Discord.GuildMember): boolean {
        return member.permissions.has("ADMINISTRATOR");
    }
}
