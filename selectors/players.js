const PlayerSelectors = {
  findPlayerById: (players, id) => players.find((player) => player.id === id),
  findPlayerByIdOrName: (players, string) => {
    // Try to find by id first.
    let player = PlayerSelectors.findPlayerById(players, string);

    // We did it!
    if (player) return player;

    // Okay, time to find by name then.
    return players.find((player) => player.name.toLowerCase() === string);
  },

  findAllUnconfirmedPlayers: (players, ignore = {id:"0"}) => players.filter((player) => !player.confirmed && player.id !== ignore.id),
  findAllWerewolfPlayers: (players) => players.filter((player) => player.role.name === "Werewolf"),
  findAllWerewolvesWithCommonTarget: (players, target) => players.filter((player) => {
    if (player.role.name === "Werewolf") {
      return player.target.id === target.id;
    }
  }),
  findAllWerewolvesWithTarget: (players) => players.filter((player) => {
    if (player.role.name === "Werewolf") {
      return !!player.target;
    }
  }),

  findAllWerewolfTargets: (players) => players.filter((player) => {
    if (player.alive && player.role.name !== "Werewolf") return true;
  }),

  findAlivePlayersButMe: (players, ignore) => players.filter((player) => player.id !== ignore.id),
  findAlivePlayers: (players) => players.filter((player) => player.alive),
  findDeadPlayers: (players) => players.filter((player) => !player.alive),
};

module.exports = PlayerSelectors;
