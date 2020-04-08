import Player from '../structs/player';
import Roles from '../roles';

/**
 * Get an array of all living werewolves given a map of players.
 * @param players A map of all players in a particular game.
 */
export function getAllLivingWerewolves(players: Map<string, Player>): Player[] {
  const livingWerewolves: Player[] = [];

  players.forEach((player) => {
    if (player.alive && player.role instanceof Roles.Werewolf) {
      livingWerewolves.push(player);
    }
  });

  return livingWerewolves;
}

/**
 * Get an array of all living villagers (non-werewolves) given a map of players.
 * @param players A map of all players in a particular game.
 */
export function getAllLivingVillagers(players: Map<string, Player>): Player[] {
  const livingVillagers: Player[] = [];

  players.forEach((player) => {
    if (player.alive && player.role instanceof Roles.Villager) {
      livingVillagers.push(player);
    }
  });

  return livingVillagers;
}
