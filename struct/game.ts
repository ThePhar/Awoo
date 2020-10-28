import { ActionWithTimestamp, Identifier } from "../types";
import Phase from "../enum/phase";
import Player from "./player";
import { immerable } from "immer";

export interface GameProperties {
  readonly id: Identifier;
  readonly settings?: unknown;
  readonly day?: number;
  readonly phase?: Phase;
  readonly players?: ReadonlyMap<Identifier, Player>;
  readonly history?: ReadonlyArray<ActionWithTimestamp>;
}

export default class Game implements GameProperties {
  [immerable] = true;

  public readonly id: Identifier;
  public readonly settings: unknown;
  public readonly day: number;
  public readonly phase: Phase;
  public readonly players: ReadonlyMap<Identifier, Player>;
  public readonly history: ReadonlyArray<ActionWithTimestamp>;

  public constructor({ id, settings, day, phase, history, players }: GameProperties) {
    this.id = id;
    this.settings = settings;
    this.day = day || 1;
    this.phase = phase || Phase.Waiting;
    this.players = players || new Map<Identifier, Player>();
    this.history = history || [];
  }
}
