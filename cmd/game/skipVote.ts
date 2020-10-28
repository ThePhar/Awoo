import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Commands from "../../enum/commands";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import Phase from "../../enum/phase";
import { SkipVote } from "../../types";
import { playerSkipVote } from "../../actions/player";
import { userCommandBaseSettings } from "../constants";

export default class SkipVoteCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...userCommandBaseSettings,
      name: Commands.NoVote,
      aliases: ["skipvote", "skip"],
      group: "game",
      memberName: Commands.NoVote,
      description: "Vote to not eliminate any player by lynching."
    });
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
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
    if (!player.flags.alive)
      return message.reply("only alive players can vote.");

    // Do not allow votes outside of the day phase.
    if (game.phase !== Phase.Day)
      return message.reply("you can only vote during the day phase.");

    // Do not allow players to skip vote if they're already skipping vote.
    if (SkipVote === player.accusing)
      return message.reply("you are already voting to not eliminate any player.");

    // Dispatch the action, and get a new game object.
    store.dispatch(playerSkipVote(player.id));

    return message.say(this.createInfoBox(
      `${message.member.toString()} has voted to not lynch any player.`,
      message.author
    ));
  }
}
