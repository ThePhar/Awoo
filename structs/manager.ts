import { CommandoClient } from "discord.js-commando";
import Game from "./game";
import { Identifier } from "../types";
import Prompt from "../prompts/base";
import { Store } from "redux";

export default class Manager extends CommandoClient {
  public games = new Map<Identifier, Store<Game>>();
  public prompts = new Map<Identifier, Prompt>();
}
