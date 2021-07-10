import { VoteType } from "../constants/vote-type";

/**
 * This is a serializable interface for non-targeting votes.
 */
export interface NonLynchingVoteInterface {
    /** The type of vote. */
    readonly type: VoteType.None | VoteType.NoLynch;

    /** An object that holds the identifier of the voter. */
    readonly id: {
        readonly voter: string;
        readonly accused: undefined;
    };
}

/**
 * This is a serializable interface for targeting votes. (i.e. lynching ones)
 */
export interface LynchingVoteInterface {
    /** The type of vote. */
    readonly type: VoteType.Lynch;

    /** An object that holds the identifier of the voter and the accused. */
    readonly id: {
        readonly voter: string;
        readonly accused: string;
    };
}

/**
 * This is a union type for either kind of serializable vote.
 */
export type VoteInterface = NonLynchingVoteInterface | LynchingVoteInterface;
