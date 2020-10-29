import { NamedPlayerAction, PlayerAction } from "../player";
import { Action } from "redux";
import { PromptAction } from "./interfaces";
import { GameActionType as Type } from "./types";

export const gameStartDay = (): Action =>
  ({ type: Type.StartDay });

export const gameStartNight = (): Action =>
  ({ type: Type.StartNight });

export const gameEnd = (): Action =>
  ({ type: Type.End });

export const gameAddPlayer = (id: string, name: string): NamedPlayerAction =>
  ({ type: Type.AddPlayer, id, name });

export const gameRemovePlayer = (id: string): PlayerAction =>
  ({ type: Type.RemovePlayer, id });

export const gameAddPrompt = (id: string): PromptAction =>
  ({ type: Type.AddPrompt, id });

export const gameRemovePrompt = (id: string): PromptAction =>
  ({ type: Type.RemovePrompt, id });
