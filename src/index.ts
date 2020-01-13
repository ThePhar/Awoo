import { Client, Message, TextChannel } from "discord.js";
import Command from "./structs/command";
import Game from "./structs/game";
import RecognisedCommands from "./structs/recognised-commands";
import Player from "./structs/player";
import Villager from "./roles/villager";
import { lobby } from "./embeds/game-events";

const client = new Client();
client.login("NjYxMDIwNDEzMDUyMDU5Njg5.XhzDBA.hukkqm7l0GMaIJt6lMEeAt08Gro");

const notificationChannel = "664620246346498079";
const discussionChannel = "661018922039902218";
const playersRole = "662067288337416205";

let game: Game;
let lobbyMessage: Message;

client.on("ready", async () => {
    const nChannel = (await client.channels.get(notificationChannel)) as TextChannel;
    const dChannel = (await client.channels.get(discussionChannel)) as TextChannel;

    game = new Game({
        id: "1",
        send: dChannel.send,
        sendNotification: (content: unknown): Promise<Message | Message[]> => {
            dChannel.send(content);
            return nChannel.send(content);
        },
    });

    lobbyMessage = await game.sendNotification(lobby(game.players));
});

client.on("message", message => {
    if (message.author.bot) return;
    if (!game) return;
    if (message.channel.id !== discussionChannel && message.channel.type !== "dm") return;

    if (message.content === "#!startDay") {
        game.startDay();
    } else if (message.content === "#!startNight") {
        game.startNight();
    } else if (message.content === "#!startFirstNight") {
        game.startFirstNight();
    } else if (message.content === "#!assign") {
        const player = game.players[0] as Player;
        player.role = new Villager(player, () => "You are a villager.");
    }

    if (message.channel.id === discussionChannel) {
        if (message.content.startsWith(Command.prefix)) {
            const command = Command.parse(message.content);
            const player = game.getPlayers(message.author.id)[0];

            if (player && command && command.type === RecognisedCommands.Leave && !game.active) {
                game.removePlayer(player);
            }

            if (player && command) {
                player.accuse(command);
            } else if (!player && command && command.type === RecognisedCommands.Join) {
                game.addPlayer(
                    new Player({
                        send: (content: unknown): void => {
                            message.author.send(content);
                        },
                        game: game,
                        name: message.author.tag,
                        id: message.author.id,
                    }),
                );
                lobbyMessage.edit(lobby(game.players));
            }
        }
    } else {
        if (message.content.startsWith(Command.prefix)) {
            const command = Command.parse(message.content);
            const player = game.getPlayers(message.author.id)[0];

            if (player && player.role && command) {
                player.role.actionHandler(command);
            }
        }
    }

    console.log("\n\n\n");
    console.log(game);
});
