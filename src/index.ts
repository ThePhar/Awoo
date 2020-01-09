import { Client, TextChannel } from "discord.js";
import { GameStore, initializeGame } from "./store/game";
import CommandHandler from "./structs/command-handler";
import Command from "./structs/command";
import { linkDiscussionChannel, linkNotificationChannel } from "./actions/meta";
import GameManager from "./structs/game-manager";
import { ROLE_ID } from "./reducers/meta";

const client = new Client();
client.login("NjYxMDIwNDEzMDUyMDU5Njg5.XhZtaQ.8-w8ypTJG3Xd3N1xoByI8qIlb5w");

const DISCUSSION_CHANNEL_ID = "661018922039902218";
const NOTIFICATION_CHANNEL_ID = "664620246346498079";

let game: GameStore;

client.on("ready", async () => {
    const channel = await client.channels.get(DISCUSSION_CHANNEL_ID);
    const channel2 = await client.channels.get(NOTIFICATION_CHANNEL_ID);

    const role = (channel as TextChannel).guild.roles.forEach(role => {
        if (role.id === ROLE_ID)
            role.members.forEach(member => {
                member.removeRole(ROLE_ID);
            });
    });

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
