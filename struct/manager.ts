import * as Types from "../types";
import Commando from "discord.js-commando";
import Game from "./game";
import Prompt from "./prompt";

export default class Manager {
  public client: Commando.CommandoClient;
  public games = new Map<Types.Identifier, Game>();
  public prompts = new Map<Types.Identifier, Prompt>();

  public constructor(client: Commando.CommandoClient) {
    this.client = client;
  }
}
