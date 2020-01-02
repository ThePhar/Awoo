const PlayerActions = {
  // Single Player modifications.
  PLAYER_ADD: "PLAYER_ADD",
  PLAYER_REMOVE: "PLAYER_REMOVE",
  PLAYER_CONFIRM_ROLE: "PLAYER_CONFIRM_ROLE",
  PLAYER_ACCUSE: "PLAYER_ACCUSE",
  PLAYER_ELIMINATE: "PLAYER_ELIMINATE",
  PLAYER_TARGET: "PLAYER_TARGET",
  PLAYER_VOTE: "PLAYER_VOTE",
  PLAYER_DISABLE_NIGHT_ACTION: "PLAYER_DISABLE_NIGHT_ACTION",

  // Multiple Player modifications.
  ALL_PLAYERS_ENABLE_NIGHT_ACTIONS: "ALL_PLAYERS_ENABLE_NIGHT_ACTIONS",
  ALL_PLAYERS_ASSIGN_ROLE: "ALL_PLAYERS_ASSIGN_ROLE",
  ALL_PLAYERS_CLEAR_CHOICES: "ALL_PLAYERS_CLEAR_CHOICES",
};
const PlayerActionCreators = {
  PlayerAdd: (player) => ({
    type: PlayerActions.PLAYER_ADD,
    player
  }),
  PlayerRemove: (player) => ({
    type: PlayerActions.PLAYER_REMOVE,
    player
  }),
  PlayerConfirmRole: (player) => ({
    type: PlayerActions.PLAYER_CONFIRM_ROLE,
    player
  }),
  PlayerAccuse: (player, accused) => ({
    type: PlayerActions.PLAYER_ACCUSE,
    player,
    accused
  }),
  PlayerEliminate: (player) => ({
    type: PlayerActions.PLAYER_ELIMINATE,
    player
  }),
  PlayerTarget: (player, target) => ({
    type: PlayerActions.PLAYER_TARGET,
    player,
    target
  }),
  PlayerVote: (player) => ({
    type: PlayerActions.PLAYER_VOTE,
    player
  }),
  PlayerDisableNightAction: (player) => ({
    type: PlayerActions.PLAYER_DISABLE_NIGHT_ACTION,
    player
  }),

  AllPlayersAssignRole: (role = undefined) => ({
    type: PlayerActions.ALL_PLAYERS_ASSIGN_ROLE,
    role
  }),
  AllPlayersEnableNightActions: () => ({
    type: PlayerActions.ALL_PLAYERS_ENABLE_NIGHT_ACTIONS
  }),
  AllPlayersClearChoices: () => ({
    type: PlayerActions.ALL_PLAYERS_CLEAR_CHOICES
  }),
};

module.exports = { PlayerActions, PlayerActionCreators };
