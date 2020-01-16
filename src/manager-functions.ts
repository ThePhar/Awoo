import { Client, Message, TextChannel } from "discord.js";
import SQL from "sql-template-strings";
import sqlite from "sqlite";
import Game from "./structs/game";
import { log } from "./util/logging";
import Command from "./structs/command";
import RecognisedCommands from "./structs/recognised-commands";
import Player from "./structs/player";
import Phases from "./structs/phases";

const games: Map<string, Game> = new Map<string, Game>();
const players: Map<string, Player> = new Map<string, Player>();

export async function changeStatus(client: Client, status: string): Promise<void> {
    try {
        await client.user.setActivity(status);
    } catch (err) {
        throw err;
    }
}
export function getGame(message: Message): Game | undefined {
    if (message.channel.type !== "text") {
        message.channel.send("Sorry, I can only accept this command within a guild Text Channel.");
        return;
    }

    // Get the game object for this server.
    return games.get(message.guild.id);
}

export async function onMessage(client: Client, message: Message): Promise<void> {
    if (message.author.bot) return;

    // TODO: Remove these debug commands.
    if (message.content === "#!active") {
        const game = getGame(message);
        if (game) {
            game.active = true;
        }
        return;
    } else if (message.content === "#!day") {
        const game = getGame(message);
        if (game) {
            game.phase = Phases.Day;
        }
        return;
    }

    // Commands
    if (message.content.startsWith(Command.prefix)) {
        const command = Command.parse(message.content);
        if (!command) return;

        // Admin :: Set channel where game notifications will be sent to.
        if      (command.type === RecognisedCommands.SetChannel) {
            const game = getGame(message);

            if (game && message.member.hasPermission("ADMINISTRATOR")) {
                const acceptableChannelRegex = /[0-9]+/;

                if (command.args.length === 0 || !acceptableChannelRegex.test(command.args[0])) {
                    message.channel.send("Please enter a valid channel id. Example: `1234567890`");
                    return;
                }

                // Check to ensure the channel they entered is a part of this server and is a TextChannel.
                const channel = await message.guild.channels.get(command.args[0]);
                if (!channel || channel.type !== "text") {
                    message.channel.send("Please enter a text channel id that belongs to this server.");
                    return;
                }

                // TODO: Create a class method to handle this.
                game.send = (content: unknown): Promise<Message | Message[]> => {
                    return (channel as TextChannel).send(content);
                };

                message.channel.send(`Got it. I will use ${channel} for sending game notifications. Be sure I can post in that channel or you may not see my messages.`);
            } else if (game) {
                message.channel.send("Sorry, only administrators of this server can change these settings.");
            }
        }
        // Admin :: Initialize a game.
        else if (command.type === RecognisedCommands.StartNewGame) {
            const game = getGame(message);

            if (message.member.hasPermission("ADMINISTRATOR")) {
                if (game && !game.active) {
                    // TODO: Add class method for handling game starting.
                    game.active = true;
                    // TODO: Create an embed for showing lobby message.
                    if (game.send) {
                        game.send("Now accepting players.");
                    }
                    message.channel.send("Now accepting players.");
                    return;
                } else if (game && game.active) {
                    // TODO: Add functionality to cancel current game and start new game.
                    message.channel.send("A game is already in progress. You cannot start a new game until the current one has completed.");
                    return;
                }
            } else {
                message.channel.send("Only an administrator of this server can start a new game.");
                return;
            }
        }
        // Player :: Join a game waiting for players.
        else if (command.type === RecognisedCommands.Join) {
            const game = getGame(message);

            if (game && game.active && game.phase === Phases.WaitingForPlayers) {
                // Ensure the player doesn't already exist.
                if (!players.get(message.author.id)) {
                    const player = new Player({
                        name: message.author.tag,
                        game: game,
                        id: message.author.id,
                        send: (content: unknown): Promise<Message | Message[]> => message.author.send(content),
                    });

                    // Attempt to send the player a message to ensure they are allowing DMs.
                    try {
                        await player.send(`You have signed up for the next game in ${message.guild.name}.`);
                        players.set(player.id, player);
                        game.addPlayer(player);
                    } catch (error) {
                        // TODO: Add an embed to show user how to allow DMs from users in same server.
                        message.channel.send("I'm sorry, but you need to allow DM from users in this server in order to join.");
                        return;
                    }

                    // TODO: Add functionality to update an embed with a list of signed up players.
                    message.channel.send(`${player} has joined the next Awoo game.`);
                    return;
                } else {
                    message.channel.send("You cannot join more than 1 Awoo game at a time.");
                    return;
                }
            } else if (game && game.active) {
                message.channel.send("You cannot join a game already in progress!");
                return;
            } else if (game && !game.active) {
                message.channel.send("A game has not been initialized by the server administrator. Please ask them to start a new game.");
                return;
            }
        }
        // Player :: Leave a game waiting for players.
        else if (command.type === RecognisedCommands.Leave) {
            const player = players.get(message.author.id);

            if (player && player.game.phase === Phases.WaitingForPlayers) {
                player.game.removePlayer(player);
                players.delete(player.id);
                message.channel.send(`${player} is no longer signed up for the next Awoo game.`);
                return;
            } else if (player) {
                // TODO: Add function to remove players in a game that's already in progress.
                message.channel.send("You cannot leave a game in progress.");
                return;
            } else if (!player) {
                message.channel.send("You are not signed up for any games.");
                return;
            }
        }
    }
}

export async function initialize(client: Client): Promise<void> {
    log(`${client.user.username} has logged into Discord successfully.`);

    await changeStatus(client, "🔄 Initializing...");
    // Get a list of every server the bot is a part of and initialize a game for every single one.
    const guilds = client.guilds;

    log("Preparing to load existing guild game data from database...");
    const database = await sqlite.open("./db.sqlite");
    try {
        // Create a table if it doesn't already exist.
        await database.run(
            SQL`CREATE TABLE IF NOT EXISTS guilds (id TEXT)`
        );

        // TODO: For right now, this doesn't have support for loading saved games. Instead it will generate a new game for each guild.
        for (const [, guild] of guilds) {
            log(`\x1b[43m LOADING \x1b[0m ${guild.name} :: ${guild.id}`, 1);
            // Check if data for this server exists.
            const guildData = await database.get(SQL`SELECT * FROM guilds WHERE id = ${guild.id}`);

            // Add this guild if not found.
            if (guildData === undefined) {
                log(`No guild game data found! Creating...`, 2);
                await database.run(SQL`INSERT INTO guilds (id) VALUES (${guild.id})`);
                log(`Completed guild game data creation.`, 2);
            }

            // Initialize our game.
            games.set(guild.id, new Game({ id: guild.id }));

            log(`\x1b[42m  READY  \x1b[0m ${guild.name} :: ${guild.id}`, 1, true);
        }

        log("Finished loading existing guild game data.");
    } catch (error) {
        throw error;
    } finally {
        database.close();
    }

    // Start listening for messages.
    client.on("message", (message) => onMessage(client, message));
    await changeStatus(client, "✅ Ready!");
}
