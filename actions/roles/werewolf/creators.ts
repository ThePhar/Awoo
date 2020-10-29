import { WerewolfActionType as Type } from "./types";
import { WerewolfTargetAction } from "./interfaces";

export const werewolfTarget = (id: string, target: string): WerewolfTargetAction =>
  ({ type: Type.Target, id, target });
