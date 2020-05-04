enum Error {
  PlayerAlreadyExists,
  GameInProgress,
  MaxPlayersReached,
  UnableToDM,
} export default Error

export type AddPlayerErrors =
  Error.PlayerAlreadyExists |
  Error.GameInProgress |
  Error.MaxPlayersReached |
  Error.UnableToDM
