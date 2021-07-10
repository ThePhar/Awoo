/**
 * This is a serializable interface for actions. All derived actions must include this information.
 */
export interface ActionInterface {
    /** Any abstract data required for this action. */
    data: any;

    /** The game identifier for this action to handle. */
    game: string;

    /** The type of action to take. */
    type: string;
}
