import { Client, TextChannel } from "discord.js";
import { GameStore, initializeGame } from "./store/game";
import CommandHandler from "./structs/command-handler";
import Command from "./structs/command";
import { linkDiscussionChannel, linkNotificationChannel } from "./actions/meta";
import GameManager from "./structs/game-manager";

const client = new Client();
client.login("NjYxNzY0NTc4OTI0OTUzNjMx.XhWVkQ.50COVJuMYfgezxA3PEjWmCdTrvA");

let game: GameStore;

client.on("ready", async () => {
    const channel = await client.channels.get("429907716165730308");
    const channel2 = await client.channels.get("663423717753225227");

    game = initializeGame();

    game.dispatch(linkDiscussionChannel(channel as TextChannel));
    game.dispatch(linkNotificationChannel(channel2 as TextChannel));

    game.subscribe(() => {
        console.log(game.getState());
    });

    const gameManager = new GameManager(game);

    console.log("ready");
});

client.on("message", message => {
    if (message.author.bot) return;
    // TODO: Add check for right channel.

    // Check for commands.
    if (message.content.startsWith(Command.prefix)) {
        const command = Command.parse(message);

        if (command) {
            CommandHandler.execute(command, game);
        }
    }
});
