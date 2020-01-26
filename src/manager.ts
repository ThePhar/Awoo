import * as Discord from "discord.js";

import Game from "./structs/game";
import Player from "./structs/player";
import Command from "./structs/command";
import Phase from "./structs/phase";
import { error, log } from "./util/logging";

import RecognisedCommands from "./structs/recognised-commands";
import ActionTemplate     from "./templates/action-templates";

import { lobbyEmbed } from "./templates/embed-templates";

export default class Manager {
    static games = new Map<string, Game>();
    static players = new Map<string, Player>();

    static readonly readonlyChannelPerms = { 'SEND_MESSAGES': false };
    static readonly playerChannelPerms = { 'SEND_MESSAGES': true };

    static mutePlayer(player: Player): void {
        // player.game.channel.overwritePermissions(player.user, this.readonlyChannelPerms);
    }
    static unmutePlayer(player: Player): void {
        // player.game.channel.overwritePermissions(player.user, this.playerChannelPerms);
    }

    static async initialize(client: Discord.Client): Promise<void> {
        log(`${client.user.username} has logged into Discord successfully.`);

        client.on("message", (message) => this.onMessageHandler(client, message));
        await client.user.setActivity("Ready!");
        log(`Now listening for messages.`);
    }

    static async onMessageHandler(client: Discord.Client, message: Discord.Message): Promise<void> {
        if (message.author.bot) return;

        const player = this.players.get(message.author.id);
        const game = ((): Game | undefined => {
            if (player) {
                return player.game;
            } else if (message.channel instanceof Discord.TextChannel) {
                return this.games.get(message.guild.id);
            } else {
                return undefined;
            }
        })();

        // DEBUG Commands. TODO: Remove.
        // if (message.content.startsWith("#!init")) {
        //     if (game) game.initializeGame();
        // } else if (message.content.startsWith("#!day")) {
        //     if (game) game.startDayPhase();
        // } else if (message.content.startsWith("#!night")) {
        //     if (game) game.startNightPhase();
        // } else if (message.content.startsWith("#!seer")) {
        //     if (player) player.role = new Seer(player);
        // } else if (message.content.startsWith("#!were")) {
        //     if (player) player.role = new Werewolf(player);
        // } else if (message.content.startsWith("#!vill")) {
        //     if (player) player.role = new Villager(player);
        // } else if (message.content.startsWith("#!kill")) {
        //     if (player) player.alive = false;
        // } else if (message.content.startsWith("#!rez")) {
        //     if (player) player.alive = true;
        // }

        // Watch for commands.
        if (message.content.startsWith(Command.prefix)) {
            log(`Received command, \`${message.content}\` from ${message.author.tag}.`);

            // Player     + Game     Command Handler
            if (player && game) this.playerHandler(message, player);
            // Non-Player + Game     Command Handler
            else if (game) await this.noPlayerHandler(message, game);
            // Non-Player + Non-Game Command Handler
            else this.noGameHandler(message);
        } else if (game && message.channel.id === game.channelId) {
            if (!player && game && game.phase !== Phase.Waiting) {
                await message.delete();
                await message.author.send(`You are not a player, ${message.author}. I have removed your message.`);
            } else if (player && !player.alive) {
                await message.delete();
                await message.author.send(`You are eliminated, ${player}. I have removed your message.`);
            }
        }
    }

    private static async noGameHandler(message: Discord.Message): Promise<void> {
        // Only listen in text channels.
        if (!(message.channel instanceof Discord.TextChannel)) {
            message.channel.send("Sorry, I can only accept commands from a server's text channel if you are not a player.");
            return;
        }

        const pseudoCommand = message.content.split(" ")[0].replace(Command.prefix, "");
        const command = new Command(pseudoCommand, "", undefined);

        switch (command.type) {
            case RecognisedCommands.StartNewGame:
                // Only administrators can start a new game.
                if (!message.member.hasPermission("ADMINISTRATOR")) {
                    message.channel.send("Only server administrators can start a new game.");
                    return;
                }

                const guild = message.guild;
                const channel = message.channel;

                log(`Starting a new game in ${guild.name} in channel #${channel.name}.`);
                const game = new Game(channel);
                this.games.set(guild.id, game);

                const lobbyMsg = await game.send(lobbyEmbed(game)) as Discord.Message;
                game.lobbyMessage = lobbyMsg;

                // Clear all old permissions.
                try {
                    game.active = true;
                    log(`Game in ${guild.name} is now accepting players. Minimum players required is 6.`);
                    return;
                } catch {
                    message.channel.send("Sorry, I need permissions to change permissions for this channel to start a game.");
                    error(`Unable to set permissions in channel ${channel.name}. Am I an admin?`);
                    return;
                }
            case RecognisedCommands.Rules:
                // TODO: Write this.
                return;
            default:
                message.channel.send("I'm sorry, I can't process any commands because there is no game running. Ask a server administrator to start a game.");
                return;
        }
    }
    private static async noPlayerHandler(message: Discord.Message, game: Game): Promise<void> {
        // Only listen in specified text channels.
        if (!(message.channel instanceof Discord.TextChannel)) {
            message.channel.send("Sorry, I can only accept commands from a server's text channel if you are not a player.");
            return;
        }
        if (message.channel.id !== game.channelId) {
            message.author.send(`I can only accept commands in <#${game.channelId}>.`);
            return;
        }
        if (game.phase !== Phase.Waiting) {
            message.author.send("Sorry, you cannot interact with a game that's in progress.");
            return;
        }

        const command = Command.parse(message.content, game);
        if (!command) return;

        switch (command.type) {
            case RecognisedCommands.Rules:
                // TODO: Write this.
                return;
            case RecognisedCommands.Join:
                // Attempt to send the player a message to ensure they're allowing DMs.
                try {
                    await message.author.send(`You have signed up for the next game in ${message.guild.name}. You will receive a notification and DM from this bot when the game begins with your role and any additional actions you may take. Do not disable DMs with this bot or you will not receive future notifications.`);
                    const player = game.addPlayer(message.member);

                    if (player) {
                        this.players.set(player.id, player);
                        game.send(`${player} has joined the next game!`);
                        if (game.lobbyMessage) {
                            await game.lobbyMessage.edit(lobbyEmbed(game));
                        }
                    } else {
                        error(`Error adding ${message.author.tag} to game in ${message.guild.name}.`);
                    }
                } catch (err) {
                    message.channel.send("I'm sorry, but you need to enable DMs from users in this server to join the next game.");
                }
                return;
            case RecognisedCommands.Leave:
                message.channel.send(`You are not signed up ${message.member}.`);
                return;
        }
    }
    private static async playerHandler(message: Discord.Message, player: Player): Promise<void> {
        const game = player.game;

        const command = Command.parse(message.content, game);
        if (!command) return;

        // Public command handler.
        log(`Command from player ${player.name}.`);
        if (message.channel.id === game.channelId) {
            log(`Command from player ${player.name}.`);
            if (!player.alive) {
                await message.delete();
                await player.send(`You are eliminated, ${player}. I have removed your message.`);
                return;
            }

            if (game.phase === Phase.Waiting) {
                switch (command.type) {
                    case RecognisedCommands.Rules:
                        // TODO: Write this.
                        return;
                    case RecognisedCommands.Join:
                        game.send(`You are already signed up, ${player}.`);
                        return;
                    case RecognisedCommands.Leave:
                        game.removePlayer(player.id);
                        this.players.delete(player.id);
                        game.send(`${player} is no longer signed up for the next game.`);
                        if (game.lobbyMessage) {
                            await game.lobbyMessage.edit(lobbyEmbed(game));
                        }
                        return;
                }
            } else {
                switch (command.type) {
                    case RecognisedCommands.Role:
                        player.role.sendRole();
                        game.send(`I have sent you your role again, ${player}.`);
                        return;
                    case RecognisedCommands.Rules:
                        // TODO: Write this.
                        return;
                    case RecognisedCommands.Join:
                        game.send(`You are already signed up, ${player}.`);
                        return;
                    case RecognisedCommands.Leave:
                        game.send(`You cannot leave a game that's in progress ${player}.`);
                        return;
                    case RecognisedCommands.Lynch:
                        const accused = command.target;
                        if (accused instanceof Player) {
                            const success = player.accuse(accused);
                            if (success) {
                                game.send(`${player} has publicly accused ${accused}.`);
                            }
                            return;
                        } else if (accused instanceof Array) {
                            game.send(ActionTemplate.accuse.multipleTargetsFound(accused, command.args));
                            return;
                        } else {
                            game.send(ActionTemplate.accuse.noTarget());
                            return;
                        }
                }
            }
        }
        // Private command handler.
        else if (message.channel.type === "dm") {
            if (!player.alive) {
                await player.send("You are eliminated and cannot interact with the game, so I have not processed your command.");
                return;
            }

            if (game.phase === Phase.Waiting) {
                switch (command.type) {
                    case RecognisedCommands.Rules:
                        // TODO: Write this.
                        return;
                    case RecognisedCommands.Join:
                        await player.send(`You are already signed up, ${player}.`);
                        return;
                    case RecognisedCommands.Leave:
                        game.removePlayer(player.id);
                        this.players.delete(player.id);
                        game.send(`${player} is no longer signed up for the next game.`);
                        return;
                }
            } else {
                switch (command.type) {
                    case RecognisedCommands.Role:
                        player.role.sendRole();
                        return;
                    case RecognisedCommands.Rules:
                        // TODO: Write this.
                        return;
                    case RecognisedCommands.Join:
                        await player.send(`You are already playing, ${player}.`);
                        return;
                    case RecognisedCommands.Leave:
                        await player.send(`You cannot leave a game that's in progress ${player}.`);
                        return;
                    case RecognisedCommands.Lynch:
                        const accused = command.target;
                        if (accused instanceof Player) {
                            const success = player.accuse(accused);
                            if (success) {
                                game.send(`${player} has privately accused another player.`);
                            }
                            return;
                        } else if (accused instanceof Array) {
                            await player.send(ActionTemplate.accuse.multipleTargetsFound(accused, command.args));
                            return;
                        } else {
                            await player.send(ActionTemplate.accuse.noTarget());
                            return;
                        }
                    default:
                        player.role.action(command);
                        return;
                }
            }
        }
    }
}
