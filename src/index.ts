import { Client, TextChannel } from "discord.js";
import { initializeGame } from "./store/game";
import CommandHandler from "./structs/command-handler";
import Command from "./structs/command";
import { linkDiscussionChannel } from "./actions/meta";

const client = new Client();
client.login("NjYxNzY0NTc4OTI0OTUzNjMx.XhQZ_Q.7LACMZontKRWtl_zuEw6DO6KpaE");

let game: ReturnType<typeof initializeGame>;

client.on("ready", async () => {
    game = initializeGame();

    const channel = await client.channels.get("429907716165730308");

    game.dispatch(linkDiscussionChannel(channel as TextChannel));

    game.subscribe(() => {
        console.log(game.getState());
    });

    console.log("ready");
});

client.on("message", message => {
    if (message.author.bot) return;

    // Check for commands.
    if (message.content.startsWith(Command.prefix)) {
        const command = Command.parse(message);

        if (command) {
            CommandHandler.execute(command, game);
        }
    }
});
