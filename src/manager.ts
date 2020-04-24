import dedent from 'dedent';
import * as Discord from 'discord.js';
import * as Logger from './util/logging';
import * as LogTemplate from './templates/log';

import Game from './structs/game';
import RecognisedCommand, { getCommand } from './structs/recognised-command';
import Command from './structs/command';
import Prompt from './structs/prompt';

/**
 * The object that will listen for all events fired by the Discord API and call the appropriate functions on
 * the associated game and player objects.
 */
export default class Manager {
  static readonly prefix = '/awoo ';
  static games = new Map<string, Game>();
  static prompts = new Map<string, Prompt>();

  /**
   * Prepare the Manager object for listening to Discord events.
   * @param client The bot client object.
   */
  static initialize(client: Discord.Client): void {
    // Log our connection.
    Logger.log(LogTemplate.ManagerInitialize(client));

    // Start listening for events.
    client.on('message', (message) => this.onMessageHandler(client, message));
    client.on('messageReactionAdd', Manager.onReactionHandler);
    client.on('messageReactionRemove', Manager.onReactionHandler);
  }

  /**
   * Checks an incoming message event to see if it can be parsed as a Command.
   * @param message The message associated with this event.
   */
  private static isValidCommand(message: Discord.Message): boolean {
    // Do not allow command messages from bots.
    if (message.author.bot) return false;

    // Do not allow commands outside of guild channels.
    if (!(message.channel instanceof Discord.TextChannel)) return false;

    // Only allow messages that start with the prefix.
    return message.content.startsWith(Manager.prefix);
  }

  /**
   * Parses messages for commands and fires associated functions for the underlying game objects.
   * @param client The bot client object.
   * @param message The message to parse.
   */
  private static onMessageHandler(client: Discord.Client, message: Discord.Message): void {
    const { member, content, channel } = message;

    // Only continue if we received a command.
    if (!Manager.isValidCommand(message)) return;
    // Do not allow messages that have no member objects.
    if (!member) return;

    const command = Command.parse(message);

    // Get the game object associated with this channel.
    const game = this.games.get(channel.id);

    // Get the player object associated with this game and user.
    let player;
    if (game) {
      player = game.players.get(member.id);
    }

    // Process the appropriate commands.
    switch (command.type) {
      case RecognisedCommand.Join:
        // Ignore join commands if no game object is available.
        if (!game) {
          message.reply('There is no game associated with this channel to join.');
          return;
        }

        game.addPlayer(member);
        break;

      case RecognisedCommand.Leave:
        // Ignore leave commands if no game object is available.
        if (!game) {
          message.reply('There is no game associated with this channel to leave.');
          return;
        }

        game.removePlayer(member);
        break;

      case RecognisedCommand.Accuse:
        // Ignore accusation commands if no game object is available.
        if (!game) {
          return;
        }

        // Ignore accusation commands if user is not a player in this game.
        if (!player) {
          message.reply('Only players can make accusations.');
          return;
        }

        player.accuse(command.joined);
        break;

      case RecognisedCommand.Rules:
        // TODO: Write rules embeds.
        break;

      case RecognisedCommand.Help:
        // TODO: Write help embeds.
        break;

      case RecognisedCommand.NewGame:
        // Ignore new game command if a game is already in progress.
        if (game) {
          message.reply('I cannot start a new game, as a game is already in progress!');
          return;
        }

        // TODO: Add administrator check.
        Manager.games.set(channel.id, new Game(channel as Discord.TextChannel));
        break;

      case RecognisedCommand.EndGame:
        if (!game) {
          message.reply('I cannot end a game as there is no game currently running.');
          return;
        }

        // TODO: Add administrator check.
        break;

      case RecognisedCommand.Eval:
        if (member.id !== '196473225268428804') return;
        try {
          // eslint-disable-next-line no-eval
          eval(content.slice(11));
        } catch (err) {
          Logger.error(`Error during EVAL: \n\t${err}`);
        }
        break;

      default:
        // Invalid command.
        message.reply(`I do not understand that command. For help, type ${getCommand(RecognisedCommand.Help)}.`)
          .catch(Manager.genericErrorLog);
        return; // Return as we do not want to log invalid commands.
    }

    // Log this command.
    Manager.commandLog(member, content);
  }

  /**
   * Listen for reaction events in DMs to change the state of players.
   * @param react The Reaction event.
   * @param user The Discord User.
   */
  private static onReactionHandler(react: Discord.MessageReaction, user: Discord.User | Discord.PartialUser): void {
    // Ignore bot reactions.
    if (user.bot) return;
    // Ignore partial users.
    if (user.partial) return;

    // Get the prompt and start handling the event.
    const prompt = Manager.prompts.get(react.message.id);
    if (prompt) {
      prompt.handleEvent(react, user);
    }
  }

  /**
   * Print a generic error message pertaining to this Manager class.
   * @param error The error object.
   */
  private static genericErrorLog(error: any): void {
    Logger.error(dedent(`
      Error while attempting to do async task in Manager.
        Error: ${error}
    `));
  }
  /**
   * Log the command fired by this member.
   * @param member The Discord member that sent the command.
   * @param content The message content string.
   */
  private static commandLog(member: Discord.GuildMember, content: string) {
    Logger.log(dedent(`
      Received a command from a user.
        User: ${member.user.tag}
        Command: ${content}
    `));
  }
}
