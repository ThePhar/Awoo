import Phase from "../enum/phase"
import Player from "./player"

export default class GameState {
  public readonly phase: Phase
  public readonly day: number
  public readonly canVotesChange: boolean
  public readonly players: ReadonlyMap<string, Player>

  public get playerCount(): number { return this.players.size }

  constructor()
  constructor(props: Properties, prevGameState: GameState)
  constructor(props?: Properties, prevGameState?: GameState) {
    // Creating a new state based on the old one.
    if (props && prevGameState) {
      this.phase = props.phase || prevGameState.phase
      this.day = props.day || prevGameState.day
      this.canVotesChange = props.canVotesChange || prevGameState.canVotesChange
      this.players = props.players || prevGameState.players
    }

    // Creating a default state.
    else {
      this.phase = Phase.AwaitingInitialization
      this.day = 0
      this.canVotesChange = true
      this.players = new Map<string, Player>()
    }
  }
}

type Properties = {
  phase?: Phase;
  day?: number;
  canVotesChange?: boolean;
  players?: Map<string, Player>;
}
