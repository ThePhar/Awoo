const PlayerSelectors = {
  findPlayerById: (players, id) => players.find((player) => player.id === id),

  findAllUnconfirmedPlayers: (players) => players.filter((player) => !player.confirmed),
  findAllWerewolfPlayers: (players) => players.filter((player) => player.role.name === "Werewolf"),
};

module.exports = PlayerSelectors;
