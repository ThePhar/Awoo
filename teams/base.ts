import * as Discord from "discord.js";

import { GameInterface, PlayerInterface, TeamInterface } from "../interfaces";
import { Color } from "../constants/color";
import { Strings } from "../constants/strings";
import { v4 as uuid } from "uuid";

export abstract class Team implements TeamInterface {
    public readonly id: string;

    public abstract readonly color: Color | number;
    public abstract readonly data: any;
    public abstract readonly description: string;
    public abstract readonly iconURL: string;
    public abstract readonly objective: string;
    public abstract readonly name: string;
    public abstract readonly solo: boolean;

    public constructor() {
        // @ts-ignore (We shouldn't be instantiating Team classes, so this shouldn't be a big deal.)
        if (this.solo) {
            this.id = uuid();
        } else {
            // @ts-ignore (We shouldn't be instantiating Team classes, so this shouldn't be a big deal.)
            this.id = this.name;
        }
    }

    /**
     * Checks to see if this team has reached their win condition based on the current game state.
     * @param game The game this team is participating in.
     */
    public abstract reachedWinCondition(game: GameInterface): boolean;

    /**
     * Returns an array of players that are members of this team.
     * @param game The game this team is participating in.
     */
    public teammates(game: GameInterface): ReadonlyArray<PlayerInterface> {
        return game.players.filter((p) => p.role.team.id === this.id);
    }

    /**
     * Returns an embed that includes all the information for this particular team. If a game interface is passed as
     * well, returns an additional column with the members of that team.
     * @param teammates A readonly array of teammates to show with the team embed.
     */
    public embed(
        teammates: ReadonlyArray<{ players: ReadonlyArray<PlayerInterface>; name: string }> = [],
    ): Discord.MessageEmbed {
        const embed = new Discord.MessageEmbed()
            .setTitle(`The ${this.name}`)
            .setDescription(this.description)
            .setThumbnail(this.iconURL)
            .setColor(this.color)
            .setFooter(`Awoo v${Strings.version}`)
            .addField("Solo Team?", this.solo ? "Yes" : "No", true)
            .addField("Objective Summary", this.objective, true);

        for (const group of teammates) {
            if (group.players.length === 0) continue;

            const players = group.players.map((player) => `${player.name}`).join(", ");
            embed.addField(group.name, players);
        }

        return embed;
    }
}
