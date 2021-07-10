import { RoleInterface } from "./role";
import { VoteInterface } from "./vote";

/**
 * This is a serializable interface for players. All derived players must include this information.
 */
export interface PlayerInterface {
    /** Is this player currently alive and can be eliminated? */
    readonly alive: boolean;

    /** Any flags that could be set that prevent this player from taking certain actions. */
    readonly flags: number;

    /** The identifier for this player, should be unique for every player. */
    readonly id: string;

    /** A human-readable name for this player. */
    readonly name: string;

    /** The role currently assigned to this player. */
    readonly role: RoleInterface;

    /** The current vote being casted by this player. */
    readonly vote: VoteInterface;
}
