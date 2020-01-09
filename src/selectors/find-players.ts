import Player from "../structs/player";
import Werewolf from "../roles/werewolf";

export function findPlayer(id: string, players: Array<Player>): Player | undefined {
    return players.find(player => player.id === id);
}

export function findPlayerByName(name: string, players: Array<Player>): Player | undefined {
    // We need to remove the ! because for some reason, client.toString doesn't call with it???
    name = name.replace("!", "");

    return players.find(player => {
        console.log(player.user.toString());
        if (player.name.toLowerCase() === name || player.user.toString().replace("!", "") === name) {
            return player;
        }
    });
}

export function findAllPlayersButMe(players: Array<Player>, ignore: Player): Array<Player> {
    return players.filter(player => {
        if (player.id !== ignore.id) {
            return player;
        }
    });
}

export function findAllVillagerTeam(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (!(player.role instanceof Werewolf)) {
            return player;
        }
    });
}

export function findAllAliveVillagers(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (player.isAlive && !(player.role instanceof Werewolf)) {
            return player;
        }
    });
}

export function findAllWerewolfTeam(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (player.role instanceof Werewolf) {
            return player;
        }
    });
}

export function findAllWerewolves(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (player.role instanceof Werewolf) {
            return player;
        }
    });
}

export function findAllAliveWerewolves(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (player.isAlive && player.role instanceof Werewolf) {
            return player;
        }
    });
}

export function findAllAlivePlayers(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (player.isAlive) {
            return player;
        }
    });
}

export function findAllEliminatedPlayers(players: Array<Player>): Array<Player> {
    return players.filter(player => {
        if (!player.isAlive) {
            return player;
        }
    });
}
