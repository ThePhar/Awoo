import { Action, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import Game from "../structs/game";

export type Accusing = Identifier | SkipVoteType | null;
export type ActionWithTimestamp = { timestamp: number, action: AnyAction };
export type Identifier = string;
export type SkipVoteType = "__SKIP__VOTE__";
export const SkipVote = "__SKIP__VOTE__";

export type Primitive = boolean | number | string | null;
export type PrimitiveCollection = Primitive[] | { [prop: string]: Primitive } | { [prop: string]: Primitive }[];
export type AnyPrimitive = Primitive | PrimitiveCollection;

export type GameThunkAction<A extends Action = AnyAction, R = void, E = void> = ThunkAction<R, Game, E, A>;
export type GameThunkDispatch = ThunkDispatch<Game, void, AnyAction>;
