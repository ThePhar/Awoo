import { Message, MessageReaction, User } from "discord.js";
import Game from "../structs/game";
import { Identifier } from "../types";
import Manager from "../structs/manager";
import Player from "../structs/player";
import { Store } from "redux";

export type ReactionHandlerFunction = (reaction: MessageReaction, user?: User) => Promise<void>;
export type EmojiList = { [name: string]: { emoji: string, description: string } };

export default abstract class Prompt {
  public readonly message: Message;
  public readonly manager: Manager;
  public readonly player: Identifier;
  public readonly store: Store<Game>;
  public readonly emojis: EmojiList = {};
  public meta = {};

  public abstract onReaction: ReactionHandlerFunction;

  public get id(): Identifier { return this.message.id; }
  public get game(): Identifier { return this.state.id; }
  public get state(): Game { return this.store.getState(); }
  public get playerState(): Player { return this.state.players.get(this.player) as Player; }

  public constructor(message: Message, manager: Manager, player: Identifier, store: Store<Game>) {
    this.message = message;
    this.manager = manager;
    this.player = player;
    this.store = store;

    void this.onCreation();
  }

  public async onCreation(): Promise<void> {
    for (const emoji in this.emojis) {
      await this.message.react(this.emojis[emoji].emoji);
    }

    this.manager.prompts.set(this.id, this);
  }

  public finalize(): void {
    this.manager.prompts.delete(this.id);
  }
}
