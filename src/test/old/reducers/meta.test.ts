import { createStore } from "redux";
import metaReducer from "../../../reducers/meta";
import Meta from "../../../structs/meta";
import { createTestTextChannel } from "../fixtures/channel";
import {
    addPlayerToEliminationQueue,
    clearEliminationQueue,
    linkDiscussionChannel,
    linkNotificationChannel,
    startDayPhase,
    startNightPhase,
} from "../../../actions/meta";
import Phases from "../../../structs/phases";
import Elimination from "../../../structs/elimination";
import { createTestPlayer } from "../fixtures/player";
import EliminationCause from "../../../structs/elimination-cause";
import { RichEmbed } from "discord.js";

const channel = createTestTextChannel();
let store: ReturnType<typeof createStore>;
beforeEach(() => {
    store = createStore(metaReducer);
});

it("should create an initial meta object on store creation", () => {
    expect(store.getState()).toBeInstanceOf(Meta);
});

it("when LINK_NOTIFICATION_CHANNEL is fired, link notification channel to meta object", () => {
    store.dispatch(linkNotificationChannel(channel));

    const state = store.getState() as Meta;
    expect(state.notificationChannel).toBe(channel);
});
it("when LINK_DISCUSSION_CHANNEL is fired, link discussion channel to meta object", () => {
    store.dispatch(linkDiscussionChannel(channel));

    const state = store.getState() as Meta;
    expect(state.discussionChannel).toBe(channel);
});
it("when START_DAY_PHASE is fired, set the phase to day", () => {
    store.dispatch(startDayPhase());

    const state = store.getState() as Meta;
    expect(state.phase).toBe(Phases.Day);
});
it("when START_NIGHT_PHASE is fired, set the phase to night and increment day", () => {
    store.dispatch(startNightPhase());

    const state = store.getState() as Meta;
    expect(state.phase).toBe(Phases.Night);
    expect(state.day).toBe(1);
});
it("when ADD_PLAYER_TO_ELIMINATION_QUEUE is fired, add an elimination to the queue", () => {
    const elimination = new Elimination(createTestPlayer(), new RichEmbed(), EliminationCause.Werewolf);

    store.dispatch(addPlayerToEliminationQueue(elimination));
    const state = store.getState() as Meta;

    expect(state.awaitingElimination[0]).toBe(elimination);
});
it("when CLEAR_ELIMINATION_QUEUE is fired, set elimination queue to empty array", () => {
    const elimination = new Elimination(createTestPlayer(), new RichEmbed(), EliminationCause.Werewolf);

    store.dispatch(addPlayerToEliminationQueue(elimination));
    store.dispatch(clearEliminationQueue());
    const state = store.getState() as Meta;

    expect(state.awaitingElimination.length).toBe(0);
});

it("should save the last ACTION fired by game.dispatch to lastAction", () => {
    store.dispatch(startDayPhase());

    const state = store.getState() as Meta;
    expect(state.lastActionFired).toStrictEqual(startDayPhase());
});
