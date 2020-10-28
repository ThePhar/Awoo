import { AnyAction } from "redux";

export type Accusing = Identifier | SkipVote | null;
export type ActionWithTimestamp = { timestamp: number, action: AnyAction };
export type Identifier = string;
export type SkipVote = "__SKIP__VOTE__";

export type Primitive = boolean | number | string | null;
export type PrimitiveCollection = Primitive[] | { [prop: string]: Primitive } | { [prop: string]: Primitive }[];
export type AnyPrimitive = Primitive | PrimitiveCollection;
