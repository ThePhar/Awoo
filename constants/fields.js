const FieldNames = {
  // Generic
  ALL_PLAYERS:        "All Players",
  ALIVE_PLAYERS:      "Alive Players",
  ELIMINATED_PLAYERS: "Eliminated Players",

  // Role Specific
  WEREWOLF_PLAYERS: "Werewolves",

  // Situational
  INSPECTED_PLAYERS: "Inspected Players",
  UNKNOWN_PLAYERS:   "Unknown Players",
  AVAILABLE_TARGETS: "Available Targets",

  // Win/Lose Teams
  WINNING_TEAM: "Winning Team",
  LOSING_TEAM:  "Losing Team",

  // Helper functions
  DiscordFieldGenerator: (fieldName, players, inline = false) => {
    let friendlyNames = [];
    if (players) {
      friendlyNames = players.map(p => p.name);
    }

    return {
      name: fieldName,
      value: friendlyNames.length > 0 ? friendlyNames.join("\n") : "---",
      inline
    };
  }
};

module.exports = FieldNames;
