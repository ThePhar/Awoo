import { Client, TextChannel } from "discord.js";
import { GameStore, initializeGame } from "./store/game";
import CommandHandler from "./structs/command-handler";
import Command from "./structs/command";
import { linkDiscussionChannel, linkNotificationChannel } from "./actions/meta";
import GameManager from "./structs/game-manager";

const client = new Client();
client.login("NjYxNzY0NTc4OTI0OTUzNjMx.XhWVkQ.50COVJuMYfgezxA3PEjWmCdTrvA");

const DISCUSSION_CHANNEL_ID = "429907716165730308";
const NOTIFICATION_CHANNEL_ID = "663423717753225227";

let game: GameStore;

client.on("ready", async () => {
    const channel = await client.channels.get(DISCUSSION_CHANNEL_ID);
    const channel2 = await client.channels.get(NOTIFICATION_CHANNEL_ID);

    // Setup the game state.
    game = initializeGame();

    // Initialize the channels.
    game.dispatch(linkDiscussionChannel(channel as TextChannel));
    game.dispatch(linkNotificationChannel(channel2 as TextChannel));

    // Console log to watch updates.
    game.subscribe(() => {
        console.log(game.getState());
    });

    // Start the GameManager
    const gameManager = new GameManager(game);
    console.log(gameManager);

    // The game is ready!
    console.log("ready");
});

client.on("message", message => {
    if (message.author.bot) return;

    // Only listen for events in the discussion channel or via DM.
    if (message.channel.id !== DISCUSSION_CHANNEL_ID && message.channel.type !== "dm") return;

    // Check for commands.
    if (message.content.startsWith(Command.prefix)) {
        const command = Command.parse(message);

        if (command) {
            CommandHandler.execute(command, game);
        }
    }
});
