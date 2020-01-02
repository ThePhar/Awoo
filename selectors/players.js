const PlayerSelectors = {
  findPlayerById: (players, id) => players.find((player) => player.id === id),

  findAllUnconfirmedPlayers: (players) => players.filter((player) => !player.confirmed),
};

module.exports = PlayerSelectors;
