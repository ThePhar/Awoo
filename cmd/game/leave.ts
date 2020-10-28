import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Commands from "../../enum/commands";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import { playerLeave } from "../../actions/player";
import { userCommandBaseSettings } from "../constants";

export default class LeaveCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...userCommandBaseSettings,
      name: Commands.Leave,
      group: "game",
      memberName: Commands.Leave,
      description: "Leave a game that you are signed up for. If you leave a game in progress, you will treated as being eliminated."
    });
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const playerID = message.author.id;
    const store = this.manager.games.get(gameID);

    // There is no game running.
    if (!store)
      return message.reply("there is no game running in this channel to leave!");

    const game = store.getState();

    // Do not allow players to leave games they aren't even signed up for.
    if (!game.players.has(playerID))
      return message.reply("you are not signed up for this game.");

    // Dispatch the action, and get a new game object.
    store.dispatch(playerLeave(playerID));
    return message.say(`${message.member.toString()} has left the game.`);
  }
}
