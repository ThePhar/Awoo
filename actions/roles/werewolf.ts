import { Identifier } from "../../types";
import { PlayerAction } from "../player/interfaces";

export enum WerewolfActionTypes {
  Target = "WEREWOLF_TARGET"
}

export interface WerewolfTargetAction extends PlayerAction {
  readonly target: Identifier;
}

export function werewolfTarget(id: Identifier, target: Identifier): WerewolfTargetAction {
  return { type: WerewolfActionTypes.Target, id, target };
}
