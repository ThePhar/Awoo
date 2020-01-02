const { produce } = require("immer");
const { MetaActionCreators, MetaActions } = require("../actions/meta");
const Phases = require("../constants/phases");

// The initial state for all meta properties.
const initialState = {
  channel: undefined,
  day: 0,
  phase: Phases.LOBBY,
  playersFlaggedForElimination: [],
  lastAction: undefined
};

function MetaReducer(state = initialState, action) {
  return produce(state, (draft) => {
    draft.lastAction = action.type;

    switch (action.type) {
      case MetaActions.LINK_CHANNEL:
        draft.channel = action.channel;
        break;
      case MetaActions.CHANGE_PHASE:
        draft.phase = action.phase;
        break;
      case MetaActions.INCREMENT_DAY:
        draft.day++;
        break;
      case MetaActions.FLAG_PLAYER_FOR_ELIMINATION:
        draft.playersFlaggedForElimination.push(action.elimination);
        break;
      case MetaActions.EMPTY_PLAYERS_FLAGGED_FOR_ELIMINATION:
        draft.playersFlaggedForElimination = [];
        break;
    }
  });
}

module.exports = MetaReducer;
