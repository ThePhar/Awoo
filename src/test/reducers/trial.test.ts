it.todo("should create an initial trial object on store creation");

describe("Action handlers", () => {
    it.todo("when RESET_TRIAL_STATE is fired, replace state with new trial object");
    it.todo("when START_TRIAL is fired, set accused player and active");
    it.todo("when END_TRIAL_ACQUITTAL is fired, reset votes, disable active, and add player to immune list");
    it.todo("when END_TRIAL_LYNCHED is fired, set startable to false and end trial active");
    it.todo("when LYNCH_VOTE is fired, add player to lynch votes array");
    it.todo("when ACQUIT_VOTE is fired, add player to acquit votes array");
});
