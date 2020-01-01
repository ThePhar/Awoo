const PlayerSelectors = {
  findPlayerById: (players, id) => players.find((player) => player.id === id)
};

module.exports = PlayerSelectors;
