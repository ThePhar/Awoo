import { ActionWithTimestamp, Phase } from "../types";
import { Reducer, Store, applyMiddleware, createStore } from "redux";
import { Player } from "./player";
import { gameReducer } from "../reducers/game";
import { immerable } from "immer";
import thunk from "redux-thunk";

export interface GameProperties {
  readonly id: string;
  readonly settings: unknown;
  readonly day: number;
  readonly phase: Phase;
  readonly players: ReadonlyMap<string, Player>;
  readonly history: ReadonlyArray<ActionWithTimestamp>;
  readonly prompts: ReadonlySet<string>;
}

export class Game implements GameProperties {
  [immerable] = true;

  public readonly id: string;
  public readonly settings: unknown; // TODO: Create struct.

  public readonly day: number = 0;
  public readonly phase: Phase = Phase.Pregame;
  public readonly players: ReadonlyMap<string, Player> = new Map();
  public readonly history: ReadonlyArray<ActionWithTimestamp> = [];
  public readonly prompts: ReadonlySet<string> = new Set();

  public constructor(id: string) {
    this.id = id;
  }

  /**
   * Creates a redux store centered around a new game object with a given identifier.
   * @param id - The identifier for this game.
   */
  public static createStore(id: string): Store<Game> {
    return createStore(
      gameReducer as Reducer<Game>,
      new Game(id),
      applyMiddleware(thunk)
    );
  }
}
