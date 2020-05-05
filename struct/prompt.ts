import * as D from "discord.js"
import Role from "./role"
import Game from "./game"
import Player from "./player"

export type EventHandler = (react: D.MessageReaction, user: D.User) => void

export default class Prompt {
  public readonly message: D.Message;
  public readonly role: Role;
  public readonly handleEvent: EventHandler;

  public constructor(message: D.Message, role: Role, handleEvent: EventHandler) {
    this.message = message
    this.role = role
    this.handleEvent = handleEvent
  }

  /**
   * Remove this prompt from the prompt map.
   */
  public destroy(): void {
    if (this.role.prompt) {
      this.role.prompt = undefined
    }
  }

  public get game(): Game { return this.role.player.game }
  public get player(): Player { return this.role.player }
}
