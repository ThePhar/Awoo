import { ActionWithTimestamp, Identifier } from "../types";
import { immerable, produce } from "immer";
import { AnyAction } from "redux";
import Phase from "../enum/phase";
import Player from "./player";

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
    this.phase = phase || Phase.Waiting;
    this.players = players || new Map<Identifier, Player>();
    this.history = history || [];
  }

  /**
   * Return a new Game object that updates from a predefined action.
   * @param {AnyAction} action - Action to take on game.
   */
  public reduce(action: AnyAction): Game {
    return produce(this, (draft) => {
      // Reduce for the game itself.
      switch (action.type) {
        default:
          break;
      }

      // Reduce for all player objects as well.
      for (const [ id, player ] of draft.players) {
        draft.players.set(id, Player.reduce(player, action));
      }

      // Add this action to our history.
      draft.history.push({ action, timestamp: Date.now() });
    });
  }
}
