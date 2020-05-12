import Player   from "../struct/player"
import { Vote } from "../struct/game"

enum Elimination {
  ForcedExit,
  Lynching,
  Werewolf
}

export default Elimination

export type EliminationContext = Player | Player[] | Vote[]
export type EliminationsWithNoContext =
  | Elimination.ForcedExit
  | Elimination.Werewolf
