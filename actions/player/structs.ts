import { AnyAction } from "redux";
import { Identifier } from "../../types";
import PlayerActionTypes from "./types";

export class PlayerAction implements AnyAction {
  public readonly type: PlayerActionTypes;
  public readonly id: Identifier;

  constructor(type: PlayerActionTypes, id: Identifier) {
    this.type = type;
    this.id = id;
  }
}

export class VoteAction extends PlayerAction {
  public readonly accusing: Identifier;

  constructor(type: PlayerActionTypes, accuser: Identifier, accusing: Identifier) {
    super(type, accuser);

    this.accusing = accusing;
  }
}
