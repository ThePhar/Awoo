const TrialActions = {
  RESET_TRIAL_STATE: "RESET_TRIAL_STATE",
  START_TRIAL: "START_TRIAL",
  END_TRIAL: "END_TRIAL",
  END_TRIAL_LYNCHED: "END_TRIAL_LYNCHED",
  LYNCH_VOTE: "LYNCH_VOTE",
  ACQUIT_VOTE: "ACQUIT_VOTE"
};
const TrialActionCreators = {
  ResetTrialState: () => ({
    type: TrialActions.RESET_TRIAL_STATE
  }),
  StartTrial: (accused) => ({
    type: TrialActions.START_TRIAL,
    accused
  }),
  EndTrial: () => ({
    type: TrialActions.END_TRIAL
  }),
  EndTrialLynched: () => ({
    type: TrialActions.END_TRIAL_LYNCHED
  }),
  LynchVote: () => ({
    type: TrialActions.LYNCH_VOTE
  }),
  AcquitVote: () => ({
    type: TrialActions.ACQUIT_VOTE
  })
};

module.exports = { TrialActions, TrialActionCreators };
