import { Command as CommandoCommand } from "discord.js-commando";
import Manager from "./manager";

export class Command extends CommandoCommand {
  public get manager(): Manager {
    return this.client as Manager;
  }
}
