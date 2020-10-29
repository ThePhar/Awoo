import { MessageReaction, User } from "discord.js";
import { CommandoClient } from "discord.js-commando";
import { Game } from "./game";
import { Prompt } from "../prompts";
import { Store } from "redux";

export class Manager extends CommandoClient {
  public games = new Map<string, Store<Game>>();
  public prompts = new Map<string, Prompt>();

  /**
   * If a reaction event was fired on an active prompt, fire the event handler for that prompt.
   * @param reaction
   * @param user
   */
  public reactionHandler(reaction: MessageReaction, user: User): void {
    // Ignore bot reactions.
    if (user.bot) return;

    const prompt = this.prompts.get(reaction.message.id);
    if (prompt) {
      void prompt.handleReaction(reaction, user);
    }
  }
}
