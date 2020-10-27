import * as Types from "../types";
import Commando from "discord.js-commando";
import Game from "./game";
import Prompt from "./prompt";

/**
 * Discord API handler and game manager.
 */
export default class Manager {
  public client: Commando.CommandoClient;
  public games = new Map<Types.Identifier, Game>();
  public prompts = new Map<Types.Identifier, Prompt>();

  /**
   * Creates a new Manager to intercept Discord API events, update game states, and pull/push
   * updates from database.
   * @param {Commando.CommandoClient} client - Discord Client for the bot that also handles
   * commands via Commando.
   */
  public constructor(client: Commando.CommandoClient) {
    this.client = client;
  }
}
