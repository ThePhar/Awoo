import Phase from "../enum/phase"

type Properties = {
  phase?: Phase;
  day?: number;
  canVotesChange?: boolean;
}

export default class GameState {
  public readonly phase: Phase
  public readonly day: number
  public readonly canVotesChange: boolean

  constructor()
  constructor(props: Properties, prevGameState: GameState)
  constructor(props?: Properties, prevGameState?: GameState) {
    // Creating a new state based on the old one.
    if (props && prevGameState) {
      this.phase = props.phase || prevGameState.phase
      this.day = props.day || prevGameState.day
      this.canVotesChange = props.canVotesChange || prevGameState.canVotesChange
    }

    // Creating a default state.
    else {
      this.phase = Phase.AwaitingInitialization
      this.day = 0
      this.canVotesChange = true
    }
  }
}

