import { AnyAction } from "redux";

export type Accusing = Identifier | SkipVote | null;
export type ActionWithTimestamp = { timestamp: number, action: AnyAction };
export type Identifier = string;
export type SkipVote = "__SKIP__VOTE__";
