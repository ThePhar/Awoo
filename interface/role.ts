import * as Discord from "discord.js";

import Appearance from "../enum/appearance";
import Roles from "../constants/role-names";
import Team from "../enum/team";

/**
 * A serializable version of Role to make saving of data in a document-database easy.
 */
export interface SerializableRole {
    readonly name: Roles;
    readonly appearance: Appearance;
    readonly team: Team;
}

export abstract class Role implements SerializableRole {
    public name: string;
    public appearance: Appearance;
    public team: Team;

    /**
     * Generate a new role with predetermined information.
     * @param role
     */
    public constructor(role: SerializableRole) {
        this.singularName = role.singularName;
        this.pluralName = role.pluralName;
        this.appearance = role.appearance;
        this.team = role.team;
    }

    public async startRole(): Promise<void> {
        await this.player.send(this.roleDescriptionEmbed());
    }

    public async startAction(): Promise<void> {
        /* Do Nothing By Default */
    }
    public resetActionState(): void {
        /* Do Nothing By Default */
    }

    protected roleDescriptionEmbed(): D.MessageEmbed {
        throw new Error("Role description not implemented.");
    }

    protected actionEmbed(): D.MessageEmbed {
        throw new Error("Action description not implemented.");
    }

    get game() {
        return this.player.game;
    }
}
