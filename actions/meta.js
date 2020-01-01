const Settings = require("../constants/settings");

const MetaActions = {
  LINK_CHANNEL: "LINK_CHANNEL",
  INCREMENT_DAY: "INCREMENT_DAY",
  CHANGE_PHASE: "CHANGE_PHASE",
  FLAG_PLAYER_FOR_ELIMINATION: "FLAG_PLAYER_FOR_ELIMINATION",
  EMPTY_PLAYERS_FLAGGED_FOR_ELIMINATION: "EMPTY_PLAYERS_FLAGGED_FOR_ELIMINATION"
};
const MetaActionCreators = {
  LinkChannel: (channel) => ({
    type: MetaActions.LINK_CHANNEL,
    channel
  }),
  IncrementDay: () => ({
    type: MetaActions.INCREMENT_DAY
  }),
  ChangePhase: (phase) => ({
    type: MetaActions.CHANGE_PHASE,
    phase
  }),
  FlagPlayerForElimination: (player) => ({
    type: MetaActions.FLAG_PLAYER_FOR_ELIMINATION,
    player
  }),
  EmptyPlayersFlaggedForElimination: (channel) => ({
    type: MetaActions.EMPTY_PLAYERS_FLAGGED_FOR_ELIMINATION
  }),

};

module.exports = { MetaActionCreators, MetaActions };
