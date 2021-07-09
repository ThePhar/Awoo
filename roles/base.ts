import * as Discord from "discord.js";

import { Appearance } from "../constants/appearance";
import { Roles } from "../constants/roles";
import { RoleDescriptions } from "../constants/role-descriptions";
import { NameDefinition, RoleNames } from "../constants/role-names";
import { TeamDefinition } from "../constants/teams";

import produce from "immer";
import fs from "fs";
import path from "path";
import { Game } from "../structs/game";

export interface SerializableRole {
    readonly type: Roles;
    readonly appearance: Appearance;
    readonly team: TeamDefinition;
}

export abstract class Role implements SerializableRole {
    public abstract readonly appearance: Appearance;
    public abstract readonly type: Roles;
    public abstract readonly team: TeamDefinition;

    /**
     * Returns the singular and plural names for this particular role.
     */
    public get names(): NameDefinition {
        const names = RoleNames[this.type];

        // Return our names, if it exists.
        if (names) {
            return names;
        }

        // No names for this role found! Whoops!
        return ["Unknown", "Unknown"];
    }

    /**
     * Returns the description for this particular role.
     */
    public get description(): string {
        const description = RoleDescriptions[this.type];

        // Return our description, if it exists.
        if (description) {
            return description;
        }

        // No description for this role found! Whoops!
        return "No description for this role was created. Please notify Phar#4444.";
    }

    /**
     * Returns an embed that contains all the needed information about a specific role.
     */
    public get embed(): Discord.MessageEmbed {
        const name = this.plural() === this.toString() ? this.toString() : `${this} (${this.plural()})`;

        return new Discord.MessageEmbed()
            .setTitle(`${name}`)
            .setColor(this.team.color)
            .setDescription(this.description)
            .setFooter("PLACEHOLDER TEXT")
            .addField("Team", this.team.name, true)
            .addField("The Seer Sees", this.appearance, true);
    }

    /**
     * Checks the roles directory for any roles and returns a map of active roles.
     */
    public static async fetchRoles(): Promise<Map<string, Role>> {
        const dir = __dirname;
        const roles: Map<string, Role> = new Map();

        // Fetch all file names in this directory that end with `.ts` or `.js`.
        const files = fs.readdirSync(dir).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        // Dynamically import each file and then add it to our roles map.
        for (const file of files) {
            const $class = await import(path.join(dir, file));

            // Attempt to add a role.
            try {
                const role: Role = new $class.default();
                const name = role.toString().replace(" ", "").toLowerCase();

                roles.set(name, role);
            } catch {
                // Just ignore this class and move on...
            }
        }

        return roles;
    }

    /**
     * Prints the singular name for this particular role.
     */
    public toString(): string {
        return `${this.names[0]}`;
    }

    /**
     * Prints the plural name for this particular role.
     **/
    public plural(): string {
        return `${this.names[1]}`;
    }

    /**
     * Returns a new version of this role, with an updated team.
     * @param newTeam The new team for this particular role.
     */
    public changeTeam(newTeam: TeamDefinition): Role {
        return produce(this, (draft) => {
            draft.team = newTeam;
        });
    }

    /**
     * Returns an embed that tells the player what they are.
     * @param _game The current game object.
     */
    public personalEmbed(_game: Game): Discord.MessageEmbed {
        return this.embed.setTitle(`You are a ${this}`);
    }
}
