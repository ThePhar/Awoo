import { Identifier, MetaProperties } from "../types";
import Appearance from "../enum/appearance";
import Role from "../structs/role";
import RoleType from "../enum/roleType";
import Team from "../enum/team";

export interface WerewolfMeta extends MetaProperties {
  target: Identifier | null;
}

export const defaultWerewolfMeta: WerewolfMeta = {
  target: null
};

export class Werewolf extends Role {
  public readonly type = RoleType.Werewolf;
  public readonly appearance = Appearance.Werewolf;
  public readonly team = Team.Werewolves;
  public readonly meta: WerewolfMeta = defaultWerewolfMeta;
  public readonly defaultMeta: WerewolfMeta = defaultWerewolfMeta;
  public readonly description = "Werewolves learn the identity of their fellow Werewolves on the first night. Each night after the first, the Werewolves will choose a target to be eliminated. The Werewolves try to keep their identity a secret from the Villagers.";
}
