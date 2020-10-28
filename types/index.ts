import { AnyAction } from "redux";

export type Identifier = string;
export type ActionWithTimestamp = { timestamp: number, action: AnyAction };
