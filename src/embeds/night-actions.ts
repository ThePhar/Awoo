/* eslint-disable prettier/prettier */
import { RichEmbed } from "discord.js";
import Player from "../structs/player";
import dedent from "dedent";
import Seer from "../roles/seer";
import mention from "../util/mention";
import Game from "../structs/game";
import Sorceress from "../roles/sorceress";
import Werewolf from "../roles/werewolf";
import Hunter from "../roles/hunter";
import Witch from "../roles/witch";

export function seerNightAction(myself: Player, game: Game): RichEmbed {
    let inspectedPlayers: Array<Player>,
        inspectedPlayersMentionable,
        readyPlayers: Array<Player>,
        readyPlayersMentionable;

    if (myself.role instanceof Seer) {
        inspectedPlayers = myself.role.inspected;
        inspectedPlayersMentionable = inspectedPlayers.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name : ""}`)

        readyPlayers = game.players.filter(player => player.id !== myself.id && !inspectedPlayers.some(i => i.id === player.id));
        readyPlayersMentionable = readyPlayers.map(player => `${mention(player.id)} (\`${player.name}\`)`);


        return new RichEmbed()
            .setTitle("Look Into The Crystal Ball")
            .setColor(0x0000ff)
            .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427035228307493/seer.png")
            .setDescription(dedent(`
                It's time to peer into the true nature of one of your fellow villagers. Target a player from the list below using \`!target [name]\` to learn if they are a werewolf.
            `))
            .addField("Available to Inspect", readyPlayersMentionable.length > 0 ? readyPlayersMentionable : "None", true)
            .addField("Already Inspected", inspectedPlayersMentionable.length > 0 ? inspectedPlayersMentionable : "None", true);
    }

    throw new Error("Error seer is not a seer???");
}
export function werewolfNightAction(game: Game): RichEmbed {
    const availablePlayers = game.players.filter(player => player.alive && !(player.role instanceof Werewolf));
    const availablePlayersMentionable = availablePlayers.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    return new RichEmbed()
        .setTitle("On The Dinner Menu")
        .setColor(0xff0000)
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427025887854596/werewolf_t.png")
        .setDescription(dedent(`
            It's time to feast. Choose a player to eliminate. The player with the most werewolves targeting them will die.
        `))
        .addField("Available to Eat", availablePlayersMentionable.length > 0 ? availablePlayersMentionable : "None", true);

}
export function hunterNightAction(myself: Player, game: Game): RichEmbed {
    const availablePlayers = game.players.filter(player => player.alive && myself.id !== player.id);
    const availablePlayersMentionable = availablePlayers.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    let desc = "";
    if (myself.role instanceof Hunter && myself.role.target && myself.role.target.alive) {
        desc = `You currently are choosing to eliminate ${mention(myself.role.target.id)} if you are eliminated. If you wish to change your mind, type \`!target [name]\` to choose a new target. You can change your mind in the day as well.`;
    } else if (myself.role instanceof Hunter && myself.role.target && !myself.role.target.alive) {
        desc = `Your current target ${mention(myself.role.target.id)} is dead. To choose a new target, type \`!target [name]\`. You can change your mind in the day as well.`;
    } else {
        desc = "You are not targeting any player to eliminate if you die. To choose a target, type `!target [name]` to target them for elimination when you die. You can change your mind in the day as well."
    }


    return new RichEmbed()
        .setTitle("Reminder to Hunt")
        .setColor(0x0000ff)
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427030245736472/hunter.png")
        .setDescription(dedent(`
            ${desc}
        `))
        .addField("Available to Hunt", availablePlayersMentionable.length > 0 ? availablePlayersMentionable : "None", true);
}
export function witchNightAction(myself: Player, game: Game): RichEmbed | undefined {
    if (myself.role instanceof Witch && myself.role.usedKillPotion && myself.role.usedSavePotion) {
        return;
    }

    let desc = "Since you still have some potions left, you may choose to use them tonight or save them for later.";

    if (myself.role instanceof Witch && !myself.role.usedSavePotion) {
        desc += "\n\nIf you want to save someone from being eliminated tonight, use `!save` to save them.";
    }
    if (myself.role instanceof Witch && !myself.role.usedKillPotion) {
        desc += "\n\nIf you want to kill someone tonight, use `!kill [name]`.";
    }

    const embed = new RichEmbed()
        .setTitle("Brewing Potions")
        .setColor(0x0000ff)
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427027389415444/witch.png")
        .setDescription(dedent(`
            ${desc}
        `));

    if (myself.role instanceof Witch && !myself.role.usedKillPotion) {
        const availablePlayers = game.players.filter(player => player.alive && myself.id !== player.id);
        const availablePlayersMentionable = availablePlayers.map(player => `${mention(player.id)} (\`${player.name}\`)`);

        embed.addField("Available to Poison",availablePlayersMentionable.length > 0 ? availablePlayersMentionable : "None", true);
    }

    return embed;
}
export function bodyguardNightAction(game: Game): RichEmbed {
    const availablePlayers = game.players.filter(player => player.alive);
    const availablePlayersMentionable = availablePlayers.map(player => `${mention(player.id)} (\`${player.name}\`)`);

    return new RichEmbed()
        .setTitle("Prepare to Protect")
        .setColor(0x0000ff)
        .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427028823605258/bodyguard.png")
        .setDescription(dedent(`
            It's time to protect someone. Choose a living player (including yourself) to protect from the werewolves tonight.
        `))
        .addField("Available to Protect", availablePlayersMentionable.length > 0 ? availablePlayersMentionable : "None", true);
}
export function sorceressNightAction(myself: Player, game: Game): RichEmbed {
    let inspectedPlayers: Array<Player>,
        inspectedPlayersMentionable,
        readyPlayers: Array<Player>,
        readyPlayersMentionable;

    if (myself.role instanceof Sorceress) {
        inspectedPlayers = myself.role.inspected;
        inspectedPlayersMentionable = inspectedPlayers.map(player => `${mention(player.id)} (\`${player.name}\`) :: ${player.role ? player.role.name : ""}`)

        readyPlayers = game.players.filter(player => player.id !== myself.id && !inspectedPlayers.some(i => i.id === player.id));
        readyPlayersMentionable = readyPlayers.map(player => `${mention(player.id)} (\`${player.name}\`)`);


        return new RichEmbed()
            .setTitle("Look Into The Crystal Ball?")
            .setColor(0xff0000)
            .setThumbnail("https://media.discordapp.net/attachments/663423717753225227/666427037384441856/sorceress.png")
            .setDescription(dedent(`
                It's time to find the seer. Use \`!target [name]\` to learn if they are a seer.
            `))
            .addField("Available to Inspect", readyPlayersMentionable.length > 0 ? readyPlayersMentionable : "None", true)
            .addField("Already Inspected", inspectedPlayersMentionable.length > 0 ? inspectedPlayersMentionable : "None", true);
    }

    throw new Error("Error sorceress is not a sorceress???");
}
