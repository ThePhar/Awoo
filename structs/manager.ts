import { MessageReaction, User } from "discord.js";
import { CommandoClient } from "discord.js-commando";
import Game from "./game";
import { Identifier } from "../types";
import Prompt from "../prompts/base";
import { Store } from "redux";

export default class Manager extends CommandoClient {
  public games = new Map<Identifier, Store<Game>>();
  public prompts = new Map<Identifier, Prompt>();

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
      void prompt.onReaction(reaction, user);
    }
  }
}
