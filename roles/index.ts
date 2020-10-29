import { Role } from "../structs/role";
import { RoleType } from "../types";
import { Seer } from "./seer";
import { Villager } from "./villager";
import { Werewolf } from "./werewolf";

export function getRole(role: RoleType): Role {
  switch (role) {
    case RoleType.Werewolf:
      return new Werewolf();

    case RoleType.Seer:
      return new Seer();

    case RoleType.Villager:
    default:
      return new Villager();
  }
}
