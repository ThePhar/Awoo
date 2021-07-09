import { Appearance } from "./constants/appearance";
import { Roles } from "./constants/roles";
import { RoleDescriptions } from "./constants/role-descriptions";
import { NameDefinition, RoleNames } from "./constants/role-names";
import { TeamDefinition } from "./constants/teams";

import produce from "immer";

export interface SerializableRole {
    readonly type: Roles;
    readonly appearance: Appearance;
    readonly team: TeamDefinition;
}

export abstract class Role implements SerializableRole {
    public abstract readonly type: Roles;
    public abstract readonly appearance: Appearance;
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
     * Prints the singular name for this particular role.
     */
    public toString(): string {
        return `**${this.names[0]}**`;
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
}
