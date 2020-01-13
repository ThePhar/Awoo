/* eslint-disable prettier/prettier */
import { RichEmbed } from "discord.js";
import Player from "../structs/player";
import mention from "../util/mention";
import dedent from "dedent";

export function playerJoined(player: Player): RichEmbed {
    return new RichEmbed().setDescription(`${mention(player.id)} has joined the next game!`);
}
export function playerLeft(player: Player): RichEmbed {
    return new RichEmbed().setDescription(`${mention(player.id)} has left the next game.`);
}

export function lobby(players: Array<Player>): RichEmbed {
    const playersMentions = players.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    return new RichEmbed()
        .setTitle("Ready For A New Game")
        .setDescription(dedent(`
            Welcome to Awoo, an auto-moderated game of werewolf for Discord! This server is registered as ${"Developer tier and has access to all features."}
            
            To join an upcoming game, use \`!join\` in <#661018922039902218>. 
            
            This is a beta test of version 0.3 of Awoo, expect things to break!        
        `))
        .setColor(0xeeeeee)
        .addField("Currently Signed Up", playersMentions.length > 0 ? playersMentions : "None");
}
