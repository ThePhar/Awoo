import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Commands from "../../enum/commands";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import Phase from "../../enum/phase";
import { playerJoin } from "../../actions/player";
import { userCommandBaseSettings } from "../constants";

export default class JoinCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...userCommandBaseSettings,
      name: Commands.Join,
      group: "game",
      memberName: Commands.Join,
      description: "Join a game that is in the Pregame Phase, waiting for players."
    });
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const playerID = message.author.id;
    const store = this.manager.games.get(gameID);

    // There is no game running.
    if (!store)
      return message.reply("there is no game running in this channel to join!");

    let game = store.getState();

    // Do not allow players to join games multiple times.
    if (game.players.has(playerID))
      return message.reply("you have already joined this game!");

    // Do not allow players to join games outside of the Pregame Phase.
    if (game.phase !== Phase.Pregame)
      return message.reply("you can only join games that are not in progress or finished.");

    // Do not allow players to join if the maximum number of players have already signed up.
    if (game.players.size >= 99)
      return message.reply("this game is full and cannot accept any more players. Sorry!");

    // Do not allow players to join if they do not accept DMs.
    try {
      // TODO: Make a join message.
      await message.author.send("Test DM");
    } catch {
      return message.reply("you need to allow Direct Messages from members of this server to join this game.");
    }

    // Dispatch the action, and get a new game object.
    store.dispatch(playerJoin(playerID));
    game = store.getState();

    const pluralPlayers = game.players.size === 1 ? "player" : "players";
    return message.reply(this.createInfoBox(
      `${message.member.toString()} has joined the next game, making ${game.players.size} ${pluralPlayers} total.`,
      message.author.avatarURL()
    ));
  }
}
