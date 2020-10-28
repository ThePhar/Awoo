import { Identifier } from "../../types";
import { PlayerAction } from "./interfaces";
import PlayerActionTypes from "./types";

export function playerJoin(id: Identifier): PlayerAction {
  return { type: PlayerActionTypes.Join, id };
}

export function playerLeave(id: Identifier): PlayerAction {
  return { type: PlayerActionTypes.Leave, id };
}
