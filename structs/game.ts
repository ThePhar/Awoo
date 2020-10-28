import { ActionWithTimestamp, Identifier } from "../types";
import { Reducer, Store, applyMiddleware, createStore } from "redux";
import Phase from "../enum/phase";
import Player from "./player";
import gameReducer from "../reducers/game";
import { immerable } from "immer";
import thunk from "redux-thunk";

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
  public readonly settings: unknown; // TODO: Create struct.
  public readonly day: number;
  public readonly phase: Phase;
  public readonly players: ReadonlyMap<Identifier, Player>;
  public readonly history: ReadonlyArray<ActionWithTimestamp>;

  public constructor({ id, settings, day, phase, history, players }: GameProperties) {
    this.id = id;
    this.settings = settings;
    this.day = day || 1;
    this.phase = phase || Phase.Pregame;
    this.players = players || new Map<Identifier, Player>();
    this.history = history || [];
  }

  /**
   * Creates a redux store centered around a new game object with a given identifier.
   * @param {Identifier} id - The identifier for this game.
   */
  public static createStore(id: Identifier): Store<Game> {
    return createStore(
      gameReducer as Reducer<Game>,
      new Game({ id }),
      applyMiddleware(thunk)
    );
  }
}
