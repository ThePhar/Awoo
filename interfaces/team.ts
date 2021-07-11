/**
 * This is a serializable interface for teams. All derived teams must include this information.
 */
export interface TeamInterface {
    /** This is an abstract container for any additional meta data required for this team. */
    readonly data: any;

    /** The identifier for this team. Useful for multiple solo teams of the same type. */
    readonly id: string;

    /** The name of this team. */
    readonly name: string;

    /** Is this team only the one player? This allows multiple solo teams of the same type. */
    readonly solo: boolean;
}
