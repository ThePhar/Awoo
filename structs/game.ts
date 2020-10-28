import { ActionWithTimestamp, Identifier } from "../types";
import { AnyAction, Reducer, Store, createStore } from "redux";
import { Draft, immerable, produce } from "immer";
import Phase from "../enum/phase";
import Player from "./player";
import { PlayerAction } from "../actions/player/interfaces";
import PlayerActionTypes from "../actions/player/types";

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
   * Return a new Game object that updates from a predefined action.
   * @param {Game} game - The game object to base off.
   * @param {AnyAction} action - Action to take on game.
   */
  public static reduce(game: Game, action: AnyAction): Game {
    return produce(game, (draft) => {
      // Reduce for the game itself.
      switch (action.type) {
        case PlayerActionTypes.Join:
          Game.addPlayer(draft, action as PlayerAction);
      }

      // Reduce for all player objects as well.
      for (const [ id, player ] of draft.players) {
        draft.players.set(id, Player.reduce(player, action));
      }

      // Add this action to our history.
      draft.history.push({ action, timestamp: Date.now() });
    });
  }

  /**
   * Creates a redux store centered around a new game object with a given identifier.
   * @param {Identifier} id - The identifier for this game.
   */
  public static createStore(id: Identifier): Store<Game> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return createStore(Game.reduce as Reducer<Game>, new Game({ id }));
  }

  /**
   * Adds a player to the game.
   */
  private static addPlayer(game: Draft<Game>, { id }: PlayerAction): Draft<Game> {
    game.players.set(id, new Player({ id }));

    return game;
  }
}
