import Trial from "../structs/trial";
import {
    ACQUIT_VOTE,
    END_TRIAL_ACQUITTAL,
    END_TRIAL_LYNCHED,
    LYNCH_VOTE,
    RESET_TRIAL_STATE,
    START_TRIAL,
    TrialActions,
    TrialPlayerAction,
} from "../interfaces/trial-actions";
import produce from "immer";

export default function trialReducer(state: Trial = new Trial(), action: TrialActions): Trial {
    return produce(state, draft => {
        switch (action.type) {
            case RESET_TRIAL_STATE:
                return new Trial();

            case START_TRIAL:
                draft.accused = (action as TrialPlayerAction).player;
                draft.active = true;
                break;

            case END_TRIAL_ACQUITTAL:
                draft.lynchVotes = [];
                draft.acquitVotes = [];

                if (draft.accused !== null) {
                    draft.immune.push(draft.accused);
                } else {
                    throw new Error(
                        "Attempted to push null accused to immune list. Are you sure there's a trial going?",
                    );
                }

                draft.accused = null;
                draft.active = false;
                break;

            case END_TRIAL_LYNCHED:
                draft.active = false;
                draft.startable = false;
                break;

            case LYNCH_VOTE:
                draft.lynchVotes.push((action as TrialPlayerAction).player);
                break;
            case ACQUIT_VOTE:
                draft.acquitVotes.push((action as TrialPlayerAction).player);
                break;
        }
    });
}
