import { Accusing, Identifier } from "../types";
import { immerable } from "immer";

export interface PlayerProperties {
  readonly id: Identifier;
  readonly accusing?: Accusing;
  readonly flags?: unknown;
  readonly role?: unknown;
}

export default class Player implements PlayerProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly accusing: Accusing;
  public readonly flags: unknown; // TODO: Create struct.
  public readonly role: unknown; // TODO: Create struct.

  public constructor({ id, accusing, flags, role }: PlayerProperties) {
    this.id = id;
    this.accusing = accusing || null;
    this.flags = flags;
    this.role = role;
  }
}
