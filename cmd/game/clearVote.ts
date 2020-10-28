import { Command } from "../../structs/command";
import { CommandoMessage } from "discord.js-commando";
import Commands from "../../enum/commands";
import Manager from "../../structs/manager";
import { Message } from "discord.js";
import Phase from "../../enum/phase";
import { playerClearVote } from "../../actions/player";
import { userCommandBaseSettings } from "../constants";

export default class ClearVoteCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...userCommandBaseSettings,
      name: Commands.ClearVote,
      aliases: ["clear"],
      group: "game",
      memberName: Commands.ClearVote,
      description: "Withdraw any votes you have thrown."
    });
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    const gameID = message.channel.id;
    const playerID = message.author.id;
    const store = this.manager.games.get(gameID);

    // There is no game running.
    if (!store)
      return message.reply("you can't clear your vote in a channel that has no game running!");

    const game = store.getState();
    const player = game.players.get(playerID);

    // Do not allow non-players to vote.
    if (!player)
      return message.reply("only players can clear votes.");

    // Do not allow dead players to vote.
    if (!player.flags.alive)
      return message.reply("only alive players can clear votes.");

    // Do not allow votes outside of the day phase.
    if (game.phase !== Phase.Day)
      return message.reply("you can only clear your vote during the day phase.");

    // Do not allow players to skip vote if they're already skipping vote.
    if (null === player.accusing)
      return message.reply("you haven't voted to eliminate or not eliminate anyone yet.");

    // Dispatch the action, and get a new game object.
    store.dispatch(playerClearVote(player.id));

    return message.reply("you have withdrawn your vote. Do not forget to vote later though!");
  }
}
