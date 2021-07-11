import { RoleType } from "../constants/role-type";
import { RoleFlags } from "../constants/role-flags";
import { TeamInterface } from "./team";

/**
 * This is a serializable interface for roles. All derived roles must include this information.
 */
export interface RoleInterface {
    /** Is this a villager, werewolf, or vampire? */
    readonly type: RoleType;

    /** This is an abstract container for any additional meta data required for this role. */
    readonly data: any;

    /** Any flags that could be set that denote this role being special from others of the same type. */
    readonly flags: number | RoleFlags;

    /** The plural version of this role name. */
    readonly pluralName: string;

    /** The singular version of this role name. */
    readonly singularName: string;

    /** The team this role is associated with. */
    readonly team: TeamInterface;
}
