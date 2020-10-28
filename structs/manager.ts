import { CommandoClient } from "discord.js-commando";
import Game from "./game";
import { Identifier } from "../types";
import { Store } from "redux";

export default class Manager extends CommandoClient {
  public games = new Map<Identifier, Store<Game>>();

  // TODO: Recreate prompt logic after actions are generated for roles.
  // public prompts = new Map<Identifier, Prompt>();
}