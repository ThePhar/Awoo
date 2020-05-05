import Player from "../struct/player"

enum Elimination {
  ForcedExit,
  Lynching,
  Werewolf,
  Bomber,
  Cupid,
  ToughGuyWerewolf,
  Hunter,
  Huntress,
  Vampire,
  Witch,
  TeenageWerewolfCondition
}

export default Elimination

export type EliminationContext = Player | Player[] | { player: Player; count: number }[]
export type EliminationsWithNoContext =
  Elimination.ForcedExit |
  Elimination.Werewolf |
  Elimination.ToughGuyWerewolf |
  Elimination.Huntress |
  Elimination.Vampire |
  Elimination.Witch |
  Elimination.TeenageWerewolfCondition
