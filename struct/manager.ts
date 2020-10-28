import Commando from "discord.js-commando";
import Game from "./game";
import { Identifier } from "../types";
import Prompt from "./prompt";

export default class Manager {
  public client: Commando.CommandoClient;
  public games = new Map<Identifier, Game>();
  public prompts = new Map<Identifier, Prompt>();

  public constructor(client: Commando.CommandoClient) {
    this.client = client;
  }
}
