import Player from '../structs/player';

/**
 * Gets a map of all players in a game and creates a custom object for easy access depending on
 * their status.
 * @param players The map of players in a given game.
 */
export default function aggregate(players: Map<string, Player>): AdvancedAggregate {
  const aggregatedPlayers: AdvancedAggregate = {
    all: [],
    alive: [],
    eliminated: [],
    role: new Map<string, Aggregate>(),
  };

  players.forEach((player) => {
    // Check if this role has been filled before, if not create it.
    const role = player.role.name;
    if (!aggregatedPlayers.role.has(role)) {
      aggregatedPlayers.role.set(role, { all: [], alive: [], eliminated: [] });
    }
    const roleAggregate = aggregatedPlayers.role.get(role) as Aggregate;

    aggregatedPlayers.all.push(player);
    roleAggregate.all.push(player);

    // Split players by living and dead.
    if (player.alive) {
      aggregatedPlayers.alive.push(player);
      roleAggregate.alive.push(player);
    } else {
      aggregatedPlayers.eliminated.push(player);
      roleAggregate.eliminated.push(player);
    }
  });

  return aggregatedPlayers;
}

export type Aggregate = {
  all: Player[],
  alive: Player[],
  eliminated: Player[],
}

type AdvancedAggregate = {
  all: Player[],
  alive: Player[],
  eliminated: Player[],
  role: Map<string, Aggregate>,
}
