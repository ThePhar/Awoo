import { Color } from "../constants/color";

/**
 * This is a serializable interface for teams. All derived teams must include this information.
 */
export interface TeamInterface {
    /** This is the hex code associated with this role. */
    readonly color: Color | number;

    /** This is an abstract container for any additional meta data required for this team. */
    readonly data: any;

    /** This is the description for what this team is and what its objectives are. */
    readonly description: string;

    /** The icon URL for this team. */
    readonly iconURL: string;

    /** The name of this team. */
    readonly name: string;

    /** This is a short description of what the objective for this team is to win. */
    readonly objective: string;

    /** Is this team only the one player? This allows multiple solo teams of the same type. */
    readonly solo: boolean;
}
