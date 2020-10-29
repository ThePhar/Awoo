import { Accusing, Identifier } from "../types";
import Flags from "./flags";
import Role from "./role";
import { Villager } from "../role";
import { immerable } from "immer";

export interface PlayerProperties {
  readonly id: Identifier;
  readonly name: string;
  readonly accusing?: Accusing;
  readonly flags?: Flags;
  readonly role?: Role;
}

export default class Player implements PlayerProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly name: string;
  public readonly accusing: Accusing;
  public readonly flags: Flags;
  public readonly role: Role;

  public constructor({ id, name, accusing, flags, role }: PlayerProperties) {
    this.id = id;
    this.name = name;
    this.accusing = accusing || null;
    this.flags = flags || { alive: true, werewolf: false };
    this.role = role || new Villager();
  }
}
