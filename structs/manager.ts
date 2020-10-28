import Commando from "discord.js-commando";
import Game from "./game";
import { Identifier } from "../types";

export default class Manager {
  public client: Commando.CommandoClient;
  public games = new Map<Identifier, Game>();

  // TODO: Recreate prompt logic after actions are generated for roles.
  // public prompts = new Map<Identifier, Prompt>();

  public constructor(client: Commando.CommandoClient) {
    this.client = client;
  }
}
