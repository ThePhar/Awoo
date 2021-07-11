import { RoleInterface, TeamInterface } from "../interfaces";
import { RoleType } from "../constants/role-type";
import { RoleFlags } from "../constants/role-flags";

export abstract class Role implements RoleInterface {
    protected abstract readonly names: [singular: string, plural: string];

    public abstract readonly data: any;
    public abstract readonly description: string;
    public abstract readonly flags: RoleFlags | number;
    public abstract readonly iconURL: string;
    public abstract readonly team: TeamInterface;
    public abstract readonly type: RoleType;
    public abstract readonly weight: number;

    public get singularName(): string {
        return this.names[0];
    }

    public get pluralName(): string {
        return this.names[1];
    }
}
