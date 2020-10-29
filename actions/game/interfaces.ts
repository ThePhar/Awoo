import { Action } from "redux";

export interface PromptAction extends Action {
  readonly id: string;
}
