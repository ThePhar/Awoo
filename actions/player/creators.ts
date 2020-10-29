import * as Action from "./interfaces";
import { Elimination, RoleType } from "../../types";
import { PlayerActionType as Type } from "./types";

export const playerEliminate = (id: string, reason: Elimination): Action.EliminationAction =>
  ({ type: Type.Eliminate, id, reason });

export const playerVoteLynch = (id: string, accusing: string): Action.VoteAction =>
  ({ type: Type.VoteLynch, id, accusing });

export const playerVoteSkip = (id: string): Action.PlayerAction =>
  ({ type: Type.VoteSkip, id });

export const playerClearVote = (id: string): Action.PlayerAction =>
  ({ type: Type.ClearVote, id });

export const playerAssignRole = (id: string, role: RoleType): Action.RoleAssignAction =>
  ({ type: Type.AssignRole, id, role });
