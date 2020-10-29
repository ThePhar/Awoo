import { PlayerAction } from "../../player/interfaces";

export interface WerewolfTargetAction extends PlayerAction {
  readonly target: string;
}
