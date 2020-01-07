import { RichEmbed } from "discord.js";
import {
    addPlayerToEliminationQueue,
    clearEliminationQueue,
    linkDiscussionChannel,
    linkNotificationChannel,
    startDayPhase,
    startNightPhase,
} from "../../actions/meta";
import {
    ADD_PLAYER_TO_ELIMINATION_QUEUE,
    CLEAR_ELIMINATION_QUEUE,
    LINK_DISCUSSION_CHANNEL,
    LINK_NOTIFICATION_CHANNEL,
    MetaChannelActions,
    MetaEliminationQueueActions,
    START_DAY_PHASE,
    START_NIGHT_PHASE,
} from "../../interfaces/meta-actions";
import Elimination from "../../structs/elimination";
import { createTestPlayer } from "../fixtures/player";
import EliminationCause from "../../structs/elimination-cause";
import { createTestTextChannel } from "../fixtures/channel";

const channel = createTestTextChannel();

describe("Meta Actions Creator", () => {
    it("should return an action for linking text channel used for notifications", () => {
        const action = linkNotificationChannel(channel) as MetaChannelActions;

        expect(action.type).toBe(LINK_NOTIFICATION_CHANNEL);
        expect(action.channel).toBe(channel);
    });
    it("should return an action for linking text channel used for discussion", () => {
        const action = linkDiscussionChannel(channel) as MetaChannelActions;

        expect(action.type).toBe(LINK_DISCUSSION_CHANNEL);
        expect(action.channel).toBe(channel);
    });
    it("should return an action for starting day phase", () => {
        const action = startDayPhase();

        expect(action.type).toBe(START_DAY_PHASE);
    });
    it("should return an action for starting night phase", () => {
        const action = startNightPhase();

        expect(action.type).toBe(START_NIGHT_PHASE);
    });
    it("should return an action for adding a player to elimination queue", () => {
        const elimination = new Elimination(createTestPlayer(), new RichEmbed(), EliminationCause.Werewolf);
        const action = addPlayerToEliminationQueue(elimination) as MetaEliminationQueueActions;

        expect(action.type).toBe(ADD_PLAYER_TO_ELIMINATION_QUEUE);
        expect(action.elimination).toBe(elimination);
    });
    it("should return an action for clearing the elimination queue", () => {
        const action = clearEliminationQueue();

        expect(action.type).toBe(CLEAR_ELIMINATION_QUEUE);
    });
});
