import * as D from 'discord.js';
import Game from './game';
import RecognisedCommand from '../enum/recognised-command';
import Command from './command';
import Prompt from './prompt';

type Identifier = string;
type User = D.User | D.PartialUser;

export default class Manager {
  client: D.Client;
  games = new Map<Identifier, Game>();
  prompts = new Map<Identifier, Prompt>();

  constructor(client: D.Client) {
    this.client = client;

    client.on('message', this.onMessageHandler.bind(this));
    client.on('messageReactionAdd', this.onReactionHandler.bind(this));
    client.on('messageReactionRemove', this.onReactionHandler.bind(this));
  }

  /**
   * If a message event was fired, parse it for a command and fire it or ignore it if invalid.
   */
  private onMessageHandler(message: D.Message): void {
    const { channel, content, member, reply } = message;

    // Ignore messages not made in TextChannels or do not have an associated member object.
    if (channel.type !== 'text' || !member) return;
    // Ignore messages from bots.
    if (message.author.bot) return;

    // Attempt to create a command and exit early if it's not valid.
    const command = Command.parse(content, member);
    if (command.type === 'invalid') return;

    // Process the appropriate commands.
    switch (command.type) {
      case RecognisedCommand.NewGame:
        this.commandNewGame(member, channel, reply);
        break;
      case RecognisedCommand.Join:
        this.commandJoin(member, channel, reply);
        break;
      case RecognisedCommand.Leave:
        this.commandLeave(member, channel, reply);
        break;
      case RecognisedCommand.Accuse:
        this.commandAccuse(member, channel, reply, command);
        break;
      default:
        break;
    }

    message.delete();
  }
  /**
   * If a reaction event was fired on an active prompt message, fire the event assigned to that prompt.
   */
  private onReactionHandler(reaction: D.MessageReaction, user: User): void {
    // Ignore bot/partial user reactions.
    if (user.bot) return;
    if (user.partial) return;

    // Get the prompt and start handling the event.
    const prompt = this.prompts.get(reaction.message.id);
    if (prompt) {
      prompt.handleEvent(reaction, user);
    }
  }

  /**
   * Check if a member is an administrator in the channel they sent the command from.
   */
  private static isAdministrator(member: D.GuildMember): boolean {
    return member.hasPermission('ADMINISTRATOR');
  }

  /* Command Handlers */
  private commandNewGame(member: D.GuildMember, channel: D.TextChannel, reply: Function) {
    if (Manager.isAdministrator(member)) {
      Game.createGame(channel, this)
        .then((game) => this.games.set(channel.id, game));
      return;
    }

    // User is not an administrator.
    reply('Only administrators of this server are allowed to create new games.');
  }
  private commandJoin(member: D.GuildMember, channel: D.TextChannel, reply: Function) {
    const game = this.games.get(channel.id);
    if (game) {
      game.addPlayer(member);
      return;
    }

    reply('There is no game to join.');
  }
  private commandLeave(member: D.GuildMember, channel: D.TextChannel, reply: Function) {
    const game = this.games.get(channel.id);
    if (game) {
      game.removePlayer(member);
      return;
    }

    reply('There is no game to leave.');
  }
  private commandAccuse(member: D.GuildMember, channel: D.TextChannel, reply: Function, command: Command) {
    const game = this.games.get(channel.id);
    const player = game ? game.getPlayer(member.id) : undefined;

    if (!game) {
      reply('There is no game in progress.');
      return;
    }

    if (!player) {
      reply('Only players cannot make accusations.');
      return;
    }

    player.accuse(command.joined);
  }
}
