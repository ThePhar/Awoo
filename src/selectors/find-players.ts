import Player from "../structs/player";

export function findPlayer(id: string, players: Array<Player>): Player | undefined {
    return players.find(player => player.client.id === id);
}
