import dedent from "dedent";
import * as D from "discord.js";
import Game from "./game";
import Command from "./command";
import Prompt from "./prompt";
import RecognisedCommand from "../enum/recognised-command";

type Identifier = string;
type User = D.User | D.PartialUser;

export default class Manager {
    public client: D.Client;
    public games = new Map<Identifier, Game>();
    public prompts = new Map<Identifier, Prompt>();

    public constructor(client: D.Client) {
        this.client = client;

        client.on("message", this.onMessageHandler.bind(this));
        client.on("messageReactionAdd", this.onReactionHandler.bind(this));
        client.on("messageReactionRemove", this.onReactionHandler.bind(this));
    }

    /**
     * If a message event was fired, parse it for a command and fire it or ignore it if invalid.
     */
    private async onMessageHandler(message: D.Message): Promise<void> {
        const { channel, content, member, reply } = message;

        // Ignore messages not made in TextChannels or do not have an associated member object.
        if (channel.type !== "text" || !member) return;
        // Ignore messages from bots.
        if (message.author.bot) return;

        // Attempt to create a command and exit early if it's not valid.
        const command = Command.parse(content, member);
        if (command.type === "invalid") return;

        // Process the appropriate commands.
        switch (command.type) {
            case RecognisedCommand.NewGame:
                this.commandNewGame(member, channel);
                break;
            case RecognisedCommand.Join:
                this.commandJoin(member, channel);
                break;
            case RecognisedCommand.Leave:
                this.commandLeave(member, channel);
                break;
            case RecognisedCommand.Accuse:
                this.commandAccuse(member, channel, command);
                break;
            case RecognisedCommand.RemoveAccusation:
                this.commandRemoveAccusation(member, channel);
                break;
            case RecognisedCommand.Help:
                this.commandHelp(member, channel);
                break;
            case RecognisedCommand.Tally:
                this.commandTally(member, channel);
                break;
            default:
                break;
        }

        // Delete the message after 5 seconds.
        setTimeout(() => message.delete(), 5000);
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
        return member.hasPermission("ADMINISTRATOR");
    }

    /* Command Handlers */
    private commandNewGame(member: D.GuildMember, channel: D.TextChannel) {
        if (Manager.isAdministrator(member)) {
            Game.generateGame(channel, this).then((game) => (game ? this.games.set(channel.id, game) : ""));
            return;
        }

        // User is not an administrator.
        channel.send("Only administrators of this server are allowed to create new games.");
    }
    private commandJoin(member: D.GuildMember, channel: D.TextChannel) {
        const game = this.games.get(channel.id);
        if (game) {
            game.addPlayer(member);
            return;
        }

        channel.send("There is no game to join.");
    }
    private commandLeave(member: D.GuildMember, channel: D.TextChannel) {
        const game = this.games.get(channel.id);
        if (game) {
            game.removePlayer(member);
            return;
        }

        channel.send("There is no game to leave.");
    }
    private commandAccuse(member: D.GuildMember, channel: D.TextChannel, command: Command) {
        const game = this.games.get(channel.id);
        const player = game ? game.getPlayer(member.id) : undefined;

        if (!game) {
            channel.send("There is no game in progress.");
            return;
        }

        if (!player) {
            channel.send("Only players can make accusations.");
            return;
        }

        player.accuse(command.joined);
    }
    private commandRemoveAccusation(member: D.GuildMember, channel: D.TextChannel) {
        const game = this.games.get(channel.id);
        const player = game ? game.getPlayer(member.id) : undefined;

        if (!game) {
            channel.send("There is no game in progress.");
            return;
        }

        if (!player) {
            channel.send("Only players can clear accusations.");
            return;
        }

        player.clearAccusationUserDriven();
    }
    private commandHelp(_: D.GuildMember, channel: D.TextChannel) {
        const game = this.games.get(channel.id);
        if (game) {
            channel.send(
                dedent(`
        For information about roles, go to https://awoo.io
        
        Command help:
        \`\`\`
        /awoo join          - Join a game that's waiting for players.
        /awoo leave         - Leave a game you've already signed up for. (Cannot leave if a game is in progress.)
        /awoo help          - This message! :)
        /awoo accuse <name> - Accuse a player of being a werewolf and vote to lynch them at the end of the day phase.
        /awoo tally         - See a list of all accusation votes that have been made currently.
        /awoo clear         - Clear your accusation vote.
        \`\`\`
      `),
            );
        }

        channel.send(
            "There is no game running right now. If you are an administrator, you can run `/awoo newgame` to configure this " +
                "channel to start a game",
        );
    }
    private commandTally(member: D.GuildMember, channel: D.TextChannel) {
        const game = this.games.get(channel.id);
        if (game) {
            const lynchVotes = game.players.alive
                .map((player) => {
                    if (player.accusing) {
                        return `${player.name} voted to lynch ${player.accusing.name}.`;
                    }

                    return null;
                })
                .filter((value) => value !== null);

            if (lynchVotes.length > 0) {
                channel.send(
                    new D.MessageEmbed()
                        .setDescription("Here are the list of current votes.")
                        .addField("Lynch Votes", lynchVotes),
                );
                return;
            }

            channel.send(`${member}, there are no accusation as of right now.`);
        }
    }
}
