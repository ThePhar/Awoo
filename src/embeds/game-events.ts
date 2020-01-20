import { RichEmbed } from "discord.js";
import Player from "../structs/player";
import mention from "../util/mention";
import dedent from "dedent";
import Game from "../structs/game";
import Team from "../structs/team";

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
export function day(game: Game): RichEmbed {
    const players = game.players;

    const alive = players.filter(player => player.alive);
    const dead = players.filter(player => !player.alive);

    const aliveMentionable = alive.map(player => `${mention(player.id)} (\`${player.name}\`)`);
    const deadMentionable = dead.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    return new RichEmbed()
        .setTitle(`Day ${game.day}`)
        .setDescription(dedent(`
            > The morning sun greets the living with its warm embrace.
            
            You have until sundown to decide on a villager to lynch. To accuse a player, use \`!accuse [name]\` in <#661018922039902218>. The player with the most accusations will be eliminated at night. You may change your accusation at any time. 
        `))
        .setColor(0x1ee0ff)
        .addField("Alive Players", aliveMentionable.length > 0 ? aliveMentionable : "None" , true)
        .addField("Eliminated Players",deadMentionable.length > 0 ? deadMentionable : "None" , true);
}
export function night(game: Game): RichEmbed {
    const players = game.players;

    const alive = players.filter(player => player.alive);
    const dead = players.filter(player => !player.alive);

    const aliveMentionable = alive.map(player => `${mention(player.id)} (\`${player.name}\`)`);
    const deadMentionable = dead.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    return new RichEmbed()
        .setTitle(`Night ${game.day}`)
        .setDescription(dedent(`
            > As the sun goes down, a chill runs down the spines of all villagers. "Will you see the morning sun again?"
            
            During the night, you will be unable to speak in <#661018922039902218>. If you have actions you can take during the night, you will be notified via DM. 
        `))
        .setColor(0x921eff)
        .addField("Alive Players", aliveMentionable.length > 0 ? aliveMentionable : "None" , true)
        .addField("Eliminated Players",deadMentionable.length > 0 ? deadMentionable : "None" , true);
}
export function villagerVictory(game: Game): RichEmbed {
    const players = game.players;

    const winners = players.filter(player => { if (player.role) return player.role.team === Team.Villagers; });
    const losers = players.filter(player => { if (player.role) return player.role.team !== Team.Villagers; });

    const winnersMentionable = winners.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name: ""}`);
    const losersMentionable = losers.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name: ""}`);

    return new RichEmbed()
        .setTitle("Villagers Win")
        .setDescription(dedent(`
            > As the final werewolf is eliminated, the villagers all breathe a sigh of relief.
            
            The villager team wins.
        `))
        .setColor(0x0000ff)
        .addField("Winners", winnersMentionable.length > 0 ? winnersMentionable : "None" , true)
        .addField("Losers",losersMentionable.length > 0 ? losersMentionable : "None" , true);

}
export function werewolvesVictory(game: Game): RichEmbed {
    const players = game.players;

    const winners = players.filter(player => { if (player.role) return player.role.team === Team.Werewolves; });
    const losers = players.filter(player => { if (player.role) return player.role.team !== Team.Werewolves; });

    const winnersMentionable = winners.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name: ""}`);
    const losersMentionable = losers.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name: ""}`);

    return new RichEmbed()
        .setTitle("Werewolves Win")
        .setDescription(dedent(`
            > The village has been whittled down to the point the werewolves can take full control of the village.
            
            The werewolf team wins.
        `))
        .setColor(0xff0000)
        .addField("Winners", winnersMentionable.length > 0 ? winnersMentionable : "None" , true)
        .addField("Losers",losersMentionable.length > 0 ? losersMentionable : "None" , true);
}
export function tannerVictory(game: Game): RichEmbed {
    const players = game.players;

    const winners = players.filter(player => { if (player.role) return player.role.team === Team.Tanner; });
    const losers = players.filter(player => { if (player.role) return player.role.team !== Team.Tanner; });

    const winnersMentionable = winners.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name: ""}`);
    const losersMentionable = losers.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name: ""}`);

    return new RichEmbed()
        .setTitle("Tanner Win")
        .setDescription(dedent(`
            > The whole village can suck it, because you can finally rest in peace.
            
            The tanner wins.
        `))
        .setColor(0x9b6321)
        .addField("Winner", winnersMentionable.length > 0 ? winnersMentionable : "None" , true)
        .addField("Losers",losersMentionable.length > 0 ? losersMentionable : "None" , true);
}

export function werewolfElimination(player: Player): RichEmbed {
    return new RichEmbed()
        .setTitle(`${player.name} is Eliminated (by werewolves)`)
        .setDescription(dedent(`
            > ${player.name} is ripped limb from limb by the werewolves.
            
            ${mention(player.id)} has been eliminated.
        `))
        .setColor(0xff0000);
}
export function lynchElimination(player: Player): RichEmbed {
    return new RichEmbed()
        .setTitle(`${player.name} is Eliminated (by lynching)`)
        .setDescription(dedent(`
            > ${player.name} is lynched by the village majority.
            
            ${mention(player.id)} has been eliminated.
        `))
        .setColor(0xff0000);
}
export function hunterElimination(player: Player, hunter: Player): RichEmbed {
    return new RichEmbed()
        .setTitle(`${player.name} is Eliminated (by hunter)`)
        .setDescription(dedent(`
            > ${player.name} is shot by ${hunter.name} through the chest as ${hunter.name} meets their own similar fate.
            
            ${mention(player.id)} has been eliminated.
        `))
        .setColor(0xff0000);
}
export function witchElimination(player: Player): RichEmbed {
    return new RichEmbed()
        .setTitle(`${player.name} is Eliminated (by witch)`)
        .setDescription(dedent(`
            > ${player.name} is poisoned by a lethal potion created by the village witch.
            
            ${mention(player.id)} has been eliminated.
        `))
        .setColor(0xff0000);
}