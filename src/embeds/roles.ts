/* eslint-disable prettier/prettier */
import { RichEmbed } from "discord.js";
import mention from "../util/mention";
import dedent from "dedent";
import Game from "../structs/game";
import Werewolf from "../roles/werewolf";

const dayCommands = ["`!accuse [name]` - Accuse a player of being a werewolf."];

export function villagerRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Villager")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427023765536799/villager_t.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a villager. Find the werewolves and eliminate them.
            
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", "*You have no night commands. Sweet dreams.*", true);
}
export function werewolfRole(game: Game): RichEmbed {
    const werewolves = game.players.filter(player => player.role instanceof Werewolf);
    const werewolvesMentions = werewolves.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    return new RichEmbed()
        .setTitle("You are a Werewolf")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427025887854596/werewolf_t.png")
        .setColor(0xff0000)
        .setDescription(dedent(`
            You are a werewolf and learn the identity of any other werewolves. Every night after the first, you and your fellow werewolves may target a player for elimination. The player with the most werewolves targeting them will be eliminated the next morning. In the event of a tie, no one will be eliminated. You will be notified what your fellow werewolves target.
        
            You are on the werewolf team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", ["`!target [name]` - Target a player for elimination."], true)
        .addField("Fellow Werewolves", werewolvesMentions);
}
export function seerRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Seer")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427035228307493/seer.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a seer and have the ability, once per night, to inspect a player and learn if they are a werewolf.
        
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", ["`!target [name]` - Inspect a player if they're a werewolf or not."], true);
}
export function lycanRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Lycan")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427032007344149/lycan.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a lycan and for all intents and purposes you are a normal villager, but you appear to the seer as a werewolf.
        
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", "*You have no night commands. Sweet dreams.*", true);
}
export function hunterRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Hunter")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427030245736472/hunter.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a hunter and may (at any point of the day) choose a target to eliminate if you are killed.
        
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", ["`!target [name]` - Target a player to eliminate if you are killed."], true);
}
export function mayorRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Mayor")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427033936592924/mayor.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a mayor and in accusations, your vote counts twice.
        
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", "*You have no night commands. Sweet dreams.*", true);
}
export function witchRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Witch")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427027389415444/witch.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a witch and may save or eliminate a player at night, once per game.
        
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", [
            "`!kill [name]` - Kill the named player. (once per game)",
            "`!save` - Save whoever is targeted by the werewolves. (once per game)",
        ], true);
}
export function tannerRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Tanner")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427021949141035/tanner.png")
        .setColor(0x9b6321)
        .setDescription(dedent(`
            You hate your job and your life. You win only if you are eliminated.
        
            You are on your own team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", "*You have no night commands. Sweet dreams.*", true);
}
export function bodyguardRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Bodyguard")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427028823605258/bodyguard.png")
        .setColor(0x0000ff)
        .setDescription(dedent(`
            You are a bodyguard and may, once per night, choose a player to protect (including yourself). That player is safe from werewolf elimination.
        
            You are on the villager team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", ["`!target [name]` - Target a player to protect."], true);
}
export function sorceressRole(): RichEmbed {
    return new RichEmbed()
        .setTitle("You are a Sorceress")
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427037384441856/sorceress.png")
        .setColor(0xff0000)
        .setDescription(dedent(`
            You are a sorceress and may, once per night, inspect a player to see if they are a seer. Help the werewolves eliminate them.
        
            You are on the werewolves team.
        `))
        .addField("Day Commands", dayCommands, true)
        .addField("Night Commands", ["`!target [name]` - Target a player to inspect."], true);
}