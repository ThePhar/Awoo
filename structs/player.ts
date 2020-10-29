import { Accusing, Identifier } from "../types";
import { Role } from "./role";
import { Villager } from "../roles/villager";
import { immerable } from "immer";

export interface PlayerProperties {
  readonly id: Identifier;
  readonly name: string;
  readonly alive: boolean;
  readonly accusing: Accusing;
  readonly role: Role;
}

export class Player implements PlayerProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly name: string;

  public readonly alive: boolean = true;
  public readonly accusing: Accusing = null;
  public readonly role: Role = new Villager();

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
