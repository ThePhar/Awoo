import { Appearance } from "../constants/appearance";
import { TeamInterface } from "./team";

/**
 * This is a serializable interface for roles. All derived roles must include this information.
 */
export interface RoleInterface {
    /** This is what this role appears to the Seer and similar roles as. */
    readonly appearance: Appearance;

    /** This is an abstract container for any additional meta data required for this role. */
    readonly data: any;

    /** This is the description for what this role does and what special abilities it has. */
    readonly description: string;

    /** Any flags that could be set that denote this role being special from others of the same type. */
    readonly flags: number;

    /** The icon URL for this role. */
    readonly iconURL: string;

    /** The plural version of this role name. */
    readonly pluralName: string;

    /** The singular version of this role name. */
    readonly singularName: string;

    /** The team this role is associated with. */
    readonly team: TeamInterface;

    /** The weight of this role's power for determining balance. Positive numbers are Villager biased and vice versa. */
    readonly weight: number;
}
