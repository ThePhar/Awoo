import * as Discord from "discord.js";

import { Color } from "../constants/color";
import { Constants } from "../constants/strings";
import { Game } from "../structs/game";

export class StartEmbed extends Discord.MessageEmbed {
    public constructor(game: Game) {
        super();

        this.setTitle(`Welcome to Awoo!`)
            .setDescription(
                "Werewolf is an interactive game of deception and deduction for two teams: Villagers and Werewolves. " +
                    "The villagers do not know who the werewolves are, and the werewolves are trying to remain undiscovered while " +
                    "they slowly eliminate the villagers, one at a time. This specific version of Werewolf was written to allow " +
                    "players the opportunity to play via Discord, unlike a traditional werewolf game with everyone in the same room " +
                    "at the same time.\n\n" +
                    "This game takes place over a series of real life days and nights. Each day, the players can discuss in the game " +
                    "channel who among them is a werewolf and vote to eliminate them (via lynching). Each night, the werewolves " +
                    "choose a player to eliminate, while the Seer learns if one player is a werewolf or not. The game is over when " +
                    "either all the werewolves are eliminated or the living werewolves outnumber the living villagers.\n\n" +
                    "There are also a number of additional roles that may come into play that could change the dynamic as the nights " +
                    "continue, but that is the gist of it.\n\n" +
                    "If you're ready to play, you can use `/join` to join the next game or start typing `/` to see the available commands " +
                    "from this bot.\n\n" +
                    `*This is v${Constants.Version} of Phar's Development build, so expect many issues.*`,
            )
            .setColor(Color.White)
            .setFooter(`v${Constants.Version}`);

        const plCount = game.players.length;

        if (plCount === 0) {
            this.addField("Players (0)", "-- *None* --");
        } else if (plCount <= 30) {
            this.addField(`Players (${plCount})`, game.players.map((p) => `${p}`).join(", "));
        } else {
            this.addField(`Players (${plCount})`, "-- *Too many player to list.* --");
        }

        // Show a scheduled start time, if at least 6 players are signed up.
        // TODO: Write me.
    }
}
