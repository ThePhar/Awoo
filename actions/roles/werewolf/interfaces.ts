import { PlayerAction } from "../../player";

export interface WerewolfTargetAction extends PlayerAction {
  readonly target: string;
}
