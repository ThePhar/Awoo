import * as Discord from "discord.js";

import { AwooClient } from "../client";
import { Command } from "./base";
import { Role as BaseRole } from "../roles";

export default class Role extends Command {
    public readonly name = "role";
    public readonly description = "Gives information about a specific role.";

    // Options
    public override readonly options: Discord.ApplicationCommandOptionData[] = [
        {
            name: "name",
            description: "The name of a specific role.",
            type: "STRING",
            required: true,
            choices: undefined,
            options: undefined,
        },
    ];

    // Handler
    public readonly handler = async (interaction: Discord.CommandInteraction, client: AwooClient): Promise<void> => {
        const roles = client.roles;
        const search = (interaction.options.array()[0]?.value as string).replace(" ", "").toLowerCase();
        let foundRoles: BaseRole[] = [];

        // Find all roles that kinda match our search term.
        for (const [name, role] of roles.entries()) {
            // If the search is EXACTLY equal, let's just call it here.
            if (name === search) {
                foundRoles = [role];
                break;
            }

            // Otherwise, let's just include all similar ones.
            if (name.includes(search)) {
                foundRoles.push(role);
            }
        }

        // Respond based on the number of roles found.
        switch (foundRoles.length) {
            // None found.
            case 0:
                await interaction.reply({
                    ephemeral: true,
                    content: `Sorry, I couldn't find any roles that matched your search term.`,
                });
                return;

            // One found.
            case 1:
                const role = foundRoles[0] as BaseRole;
                await interaction.reply({
                    ephemeral: true,
                    content: "Here's the basic role information for this role:",
                    embeds: [role.embed],
                });
                return;

            // Multiple found.
            default:
                await interaction.followUp({
                    ephemeral: true,
                    content:
                        `There are many roles with that search term, can you be more specific?\n\nFound: ` +
                        foundRoles.map((r) => `\`${r}\``).join(", "),
                });
                return;
        }
    };
}
