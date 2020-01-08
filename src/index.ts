import { Client, TextChannel } from "discord.js";
import { initializeGame } from "./store/game";
import CommandHandler from "./structs/command-handler";
import Command from "./structs/command";
import { linkDiscussionChannel, startDayPhase, startNightPhase } from "./actions/meta";
import { assignPlayerRole } from "./actions/players";
import { GameState } from "./test/store/game.test";
import Villager from "./roles/villager";
import Werewolf from "./roles/werewolf";
import NightActive from "./interfaces/night-active-role";
import Role from "./interfaces/role";
import Seer from "./roles/seer";

const client = new Client();
client.login("NjYxNzY0NTc4OTI0OTUzNjMx.XhQZ_Q.7LACMZontKRWtl_zuEw6DO6KpaE");

const game = initializeGame();

client.on("ready", async () => {
    const channel = await client.channels.get("429907716165730308");

    game.dispatch(linkDiscussionChannel(channel as TextChannel));

    game.subscribe(() => {
        console.log(game.getState());
    });

    console.log("ready");
});

client.on("message", message => {
    if (message.author.bot) return;
    // TODO: Add check for right channel.

    if (message.content === "#!day") {
        game.dispatch(startDayPhase());
    }
    if (message.content === "#!night") {
        game.dispatch(startNightPhase());
    }
    if (message.content === "#!villager") {
        const state = game.getState() as GameState;
        const player = state.players[1];
        game.dispatch(assignPlayerRole(player, new Villager(player)));
    }
    if (message.content === "#!werewolf") {
        const state = game.getState() as GameState;
        const player = state.players[1];
        game.dispatch(assignPlayerRole(player, new Werewolf(player)));
    }
    if (message.content === "#!seer") {
        const state = game.getState() as GameState;
        const player = state.players[0];
        game.dispatch(assignPlayerRole(player, new Seer(player)));
    }
    if (message.content === "#!embed") {
        const state = game.getState() as GameState;
        const player = state.players[0];

        if (player.role && state.meta.discussionChannel) {
            state.meta.discussionChannel.send((player.role as Role).embed());
        }
    }
    if (message.content === "#!nightEmbed") {
        const state = game.getState() as GameState;
        const player = state.players[0];

        // TODO: Write a custom function for testing if an interface.
        if (player.role && state.meta.discussionChannel && (player.role as NightActive).nightAction) {
            state.meta.discussionChannel.send((player.role as NightActive).nightEmbed());
        }
    }

    // Check for commands.
    if (message.content.startsWith(Command.prefix)) {
        const command = Command.parse(message);

        if (command) {
            CommandHandler.execute(command, game);
        }
    }
});
