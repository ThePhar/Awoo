import * as Discord from 'discord.js';
import Role from '../interface/role';

/**
 * Handles reaction events tied to a particular message.
 */
export default class Prompt {
  readonly message: Discord.Message;
  readonly role: Role;
  readonly handleEvent: (react: Discord.MessageReaction, user: Discord.User) => void;

  constructor(
    message: Discord.Message,
    role: Role,
    handleEvent: (react: Discord.MessageReaction, user: Discord.User) => void,
  ) {
    this.message = message;
    this.role = role;
    this.handleEvent = handleEvent;

    this.role.game.manager.prompts.set(message.id, this);
  }

  /**
   * Remove this prompt from the prompt map.
   */
  destroy(): void {
    if (this.role.prompt) {
      this.role.prompt = null;
    }

    this.role.game.manager.prompts.delete(this.message.id);
  }

  get game() { return this.role.player.game; }
  get player() { return this.role.player; }
}
