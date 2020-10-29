import { Action, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Game } from "../structs/game";

export type Accusing = Identifier | SkipVoteType | null;
export type ActionWithTimestamp = { timestamp: number, action: AnyAction };
export type Identifier = string;
export type SkipVoteType = "__SKIP__VOTE__";
export const SkipVote = "__SKIP__VOTE__";

export type Primitive = boolean | number | string | null;
export type PrimitiveCollection = Primitive[] | MetaProperties | MetaProperties[];
export type AnyPrimitive = Primitive | PrimitiveCollection;

export interface MetaProperties {
  [prop: string]: AnyPrimitive;
}

export type GameThunkAction<E = unknown, A extends Action = AnyAction, R = void> = ThunkAction<R, Game, E, A>;
export type GameThunkDispatch = ThunkDispatch<Game, void, AnyAction>;

export const werewolfEmoji = "https://cdn.discordapp.com/emojis/667194685374332969";
