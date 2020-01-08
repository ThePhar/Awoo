import Player from "../structs/player";

export function findPlayer(id: string, players: Array<Player>): Player | undefined {
    return players.find(player => player.client.id === id);
}
export function findPlayerByName(name: string, players: Array<Player>): Player | undefined {
    // We need to remove the ! because for some reason, client.toString doesn't call with it???
    name = name.replace("!", "");

    return players.find(player => {
        if (player.client.username === name || player.client.toString() === name) {
            return player;
        }
    });
}
