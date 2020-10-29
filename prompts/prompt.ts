import { Message, MessageEmbed, MessageReaction, TextChannel, User } from "discord.js";
import { gameAddPrompt, gameRemovePrompt } from "../actions/game/creators";
import { Game } from "../structs/game";
import { Manager } from "../structs/manager";
import { Player } from "../structs/player";
import { Store } from "redux";

export type EmojiList = { [name: string]: { emoji: string, description: string } };

export interface PromptProperties {
  message: Message,
  manager: Manager,
  playerId: string,
  store: Store<Game>,
  gameChannel: TextChannel
}

export abstract class Prompt {
  protected readonly message: Message;
  protected readonly manager: Manager;
  protected readonly gameChannel: TextChannel;
  protected readonly playerId: string;
  protected readonly store: Store<Game>;

  protected static readonly supportedReactions: EmojiList;

  protected get id(): string { return this.message.id; }
  protected get state(): Game { return this.store.getState(); }
  protected get player(): Player | undefined { return this.state.players.get(this.playerId); }

  protected constructor({ gameChannel, manager, message, playerId, store }: PromptProperties) {
    this.message = message;
    this.manager = manager;
    this.gameChannel = gameChannel;
    this.playerId = playerId;
    this.store = store;
  }

  /**
   * Add this prompt to the Manager script and keep a reference of it in the game store.
   */
  protected addPrompt(): void {
    this.manager.prompts.set(this.id, this);
    this.store.dispatch(gameAddPrompt(this.id));
  }

  /**
   * Remove this prompt from the Manager script and remove it's reference from the game store.
   */
  protected removePrompt(): void {
    this.manager.prompts.delete(this.id);
    this.store.dispatch(gameRemovePrompt(this.id));
  }

  /**
   * Creates a new prompt object based of information given.
   * @abstract
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static create(_manager: Manager, _store: Store<Game>, _player: string): Promise<Prompt> {
    throw new Error(`Create function not implemented for ${this.name}.`);
  }

  /**
   * Generates a default MessageEmbed from given information.
   * @abstract
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected static defaultEmbed(_: unknown): MessageEmbed {
    throw new Error(`Default embed not implemented for ${this.name}.`);
  }

  public abstract handleReaction(reaction: MessageReaction, user?: User): Promise<void>;
}
