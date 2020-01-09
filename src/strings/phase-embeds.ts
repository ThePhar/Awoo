import { GameState } from "../store/game";
import { RichEmbed } from "discord.js";
import Colors from "../structs/colors";
import PhaseStrings from "./phase";
import Tips from "./tips";
import randomItem from "random-item";
import FieldStrings from "./fields";
import {
    findAllAlivePlayers,
    findAllEliminatedPlayers,
    findAllVillagerTeam,
    findAllWerewolfTeam,
} from "../selectors/find-players";
import Player from "../structs/player";
import RoleStrings from "./roles";
import { getDuplicateCounts } from "../util/duplicate";

function roleFormat(players: Array<Player>): Array<string> {
    return players.map(player => {
        return player.toString() + ` (**${player.role.name}**)`;
    });
}

export function lobbyEmbed(gameState: GameState): RichEmbed {
    return new RichEmbed()
        .setTitle(PhaseStrings.lobby.title)
        .setDescription(PhaseStrings.lobby.description)
        .setColor(Colors.Informational)
        .addField(
            PhaseStrings.lobby.signedUpField,
            gameState.players.length > 0 ? gameState.players : FieldStrings.none,
        )
        .setFooter(randomItem(Tips));
}

// TODO
export function firstNightEmbed(gameState: GameState): RichEmbed {
    return new RichEmbed()
        .setTitle(`Night 1 - The Calm Before The Storm`)
        .setDescription(PhaseStrings.firstNight.description)
        .setColor(Colors.Night)
        .addField(FieldStrings.title.alivePlayers, gameState.players, true)
        .addField(FieldStrings.title.eliminatedPlayers, FieldStrings.none, true)
        .addField(FieldStrings.title.activeRolesField, getDuplicateCounts(gameState.players), true)
        .setFooter(randomItem(Tips));
}

export function dayEmbed(gameState: GameState): RichEmbed {
    const alivePlayers = findAllAlivePlayers(gameState.players);
    const deadPlayers = findAllEliminatedPlayers(gameState.players);

    return new RichEmbed()
        .setTitle(`Day ${gameState.meta.day}`)
        .setDescription(PhaseStrings.firstNight.description)
        .setColor(Colors.Day)
        .addField(FieldStrings.title.alivePlayers, alivePlayers.length > 0 ? alivePlayers : FieldStrings.none, true)
        .addField(FieldStrings.title.eliminatedPlayers, deadPlayers.length > 0 ? deadPlayers : FieldStrings.none, true)
        .addField(FieldStrings.title.activeRolesField, getDuplicateCounts(gameState.players), true)
        .setFooter(randomItem(Tips));
}

export function nightEmbed(gameState: GameState): RichEmbed {
    const alivePlayers = findAllAlivePlayers(gameState.players);
    const deadPlayers = findAllEliminatedPlayers(gameState.players);

    return new RichEmbed()
        .setTitle(`Night ${gameState.meta.day}`)
        .setDescription(PhaseStrings.night.description)
        .setColor(Colors.Night)
        .addField(FieldStrings.title.alivePlayers, alivePlayers.length > 0 ? alivePlayers : FieldStrings.none, true)
        .addField(FieldStrings.title.eliminatedPlayers, deadPlayers.length > 0 ? deadPlayers : FieldStrings.none, true)
        .addField(FieldStrings.title.activeRolesField, getDuplicateCounts(gameState.players), true)
        .setFooter(randomItem(Tips));
}

export function villagerVictoryEmbed(gameState: GameState): RichEmbed {
    const villagers = roleFormat(findAllVillagerTeam(gameState.players));
    const werewolves = roleFormat(findAllWerewolfTeam(gameState.players));

    return new RichEmbed()
        .setTitle(`Villagers Win`)
        .setDescription(RoleStrings.villager.victoryDescription)
        .setColor(Colors.VillagerBlue)
        .addField(FieldStrings.title.winningTeam, villagers.length > 0 ? villagers : FieldStrings.none, true)
        .addField(FieldStrings.title.losingTeam, werewolves.length > 0 ? werewolves : FieldStrings.none, true)
        .setFooter(randomItem(Tips));
}

export function werewolfVictoryEmbed(gameState: GameState): RichEmbed {
    const villagers = roleFormat(findAllVillagerTeam(gameState.players));
    const werewolves = roleFormat(findAllWerewolfTeam(gameState.players));

    return new RichEmbed()
        .setTitle(`Werewolves Win`)
        .setDescription(RoleStrings.werewolf.victoryDescription)
        .setColor(Colors.WerewolfRed)
        .addField(FieldStrings.title.winningTeam, werewolves.length > 0 ? werewolves : FieldStrings.none, true)
        .addField(FieldStrings.title.losingTeam, villagers.length > 0 ? villagers : FieldStrings.none, true)
        .setFooter(randomItem(Tips));
}
