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

  findAllUnconfirmedPlayers: (players) => players.filter((player) => !player.confirmed),
  findAllWerewolfPlayers: (players) => players.filter((player) => player.role.name === "Werewolf"),
};

module.exports = PlayerSelectors;
