const { produce } = require("immer");
const { TrialActions } = require("../actions/trial");

const initialState = {
  active: false,
  immune: [],
  accused: undefined,
  lynchVotes: 0,
  acquitVotes: 0
};

function TrialReducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case TrialActions.RESET_TRIAL_STATE:
        return initialState;
      case TrialActions.START_TRIAL:
        draft.active = true;
        draft.accused = action.accused;
        break;
      case TrialActions.END_TRIAL:
        draft.active = false;
        draft.immune.push(draft.accused);
        draft.accused = undefined;
        draft.lynchVotes = 0;
        draft.acquitVotes = 0;
        break;
      case TrialActions.LYNCH_VOTE:
        draft.lynchVotes++;
        break;
      case TrialActions.ACQUIT_VOTE:
        draft.acquitVotes++;
        break;
    }
  });
}

module.exports = TrialReducer;
