import { Player } from "./player";
import { VoteType } from "../constants/vote-type";

export interface SerializableVote {
    readonly type: VoteType;
    readonly voterId: string;
    readonly targetId: string;
}

export class Vote implements SerializableVote {
    public readonly type: VoteType;
    public readonly voter: Player;
    public readonly target: Player;

    private constructor(type: VoteType, voter: Player, target: Player) {
        this.type = type;
        this.voter = voter;
        this.target = target;
    }

    /**
     * Get the id for this voter.
     */
    public get voterId(): string {
        return this.voter.id;
    }

    /**
     * Get the id for this target.
     */
    public get targetId(): string {
        return this.target.id;
    }

    /**
     * Return a vote object with neither vote type.
     * @param voter The player who voted.
     */
    public static noVote(voter: Player): Vote {
        return new Vote(VoteType.None, voter, voter);
    }

    /**
     * Return a vote object to lynch another player.
     * @param voter The player who voted.
     * @param target The target player to lynch.
     */
    public static lynchVote(voter: Player, target: Player): Vote {
        return new Vote(VoteType.Lynch, voter, target);
    }

    /**
     * Return a vote object to not lynch any player.
     * @param voter The player who voted.
     */
    public static noLynchVote(voter: Player): Vote {
        return new Vote(VoteType.NoLynch, voter, voter);
    }
}
