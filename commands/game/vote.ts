import { Command, Manager } from "../../structs";
import { Command as CommandType, Phase } from "../../types";
import { GuildMember, Message } from "discord.js";
import { CommandoMessage } from "discord.js-commando";
import { playerVoteLynch } from "../../actions";
import { userCommandBaseSettings } from "../constants";

export default class VoteCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...userCommandBaseSettings,
      name: CommandType.Vote,
      aliases: ["accuse"],
      group: "game",
      memberName: CommandType.Vote,
      description: "Vote to eliminate a player via lynching.",
      args: [{
        key: "player",
        prompt: "Which player are you trying to vote to eliminate?",
        type: "member"
      }]
    });
  }

  public async run(message: CommandoMessage, args: { player: GuildMember }): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const playerID = message.author.id;
    const store = this.manager.games.get(gameID);

    // There is no game running.
    if (!store)
      return message.reply("you can't vote in a channel that has no game running!");

    const game = store.getState();
    const player = game.players.get(playerID);

    // Do not allow non-players to vote.
    if (!player)
      return message.reply("only players can vote.");

    // Do not allow dead players to vote.
    if (!player.alive)
      return message.reply("only alive players can vote.");

    // Do not allow votes outside of the day phase.
    if (game.phase !== Phase.Day)
      return message.reply("you can only vote during the day phase.");

    const accused = game.players.get(args.player.id);

    // Do not allow accusations against non-players.
    if (!accused)
      return message.reply("that user is not a player in this game.");

    // Do not allow player to target themselves.
    if (accused.id === player.id)
      return message.reply("you cannot vote to lynch yourself. Not for lack of trying though.");

    // Do not allow player to target eliminated players.
    if (!accused.alive)
      return message.reply("you cannot vote to eliminate players that are already eliminated.");

    // Do not allow players to vote to eliminate someone they ALREADY are voting for.
    if (accused.id === player.accusing)
      return message.reply("you are already voting to eliminate that player.");

    // Dispatch the action, and get a new game object.
    store.dispatch(playerVoteLynch(player.id, accused.id));

    return message.say(this.createInfoBox(
      `${message.member.toString()} has voted to eliminate ${args.player.toString()}.`,
      message.author
    ));
  }
}
