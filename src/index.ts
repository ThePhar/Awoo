import * as Discord from "discord.js";
import * as Env     from "dotenv";

import Manager from "./manager";
// import Player from "./structs/player";
// import Game from "./structs/game";
// import Phase from "./structs/phase";
// import Player from "./structs/player";
// import Werewolf from "./roles/werewolf";
// import Command from "./structs/command";
// import RecognisedCommands from "./structs/recognised-commands";
// import Seer from "./roles/seer";

console.clear();

const result = Env.config();
if (result.error) {
    throw result.error;
}

const client = new Discord.Client();
client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => Manager.initialize(client))
    .catch((err) => { console.error(err); });

// let game: Game;
//
// client.on("message", async (message) => {
//     if (message.author.bot) return;
//
//     if (message.content.startsWith("#!init")) {
//         game = new Game(message.channel as TextChannel, {
//             phase: Phase.Waiting,
//             day: 0,
//             active: true
//         });
//
//         const p1 = game.addPlayer(message.member) as Player;
//         p1.role = new Werewolf(p1);
//         const p2 = game.addPlayer(await message.guild.fetchMember("589023961367576598")) as Player;
//         p2.role = new Seer(p2);
//         const p3 = game.addPlayer(await message.guild.fetchMember("661764578924953631")) as Player;
//
//         // p1.accusing = p2;
//         // p2.accusing = p3;
//
//         game.initializeGame();
//     }
//
//     if (message.content.startsWith("#!day")) {
//         game.startDayPhase();
//         return;
//     }
//     if (message.content.startsWith("#!night")) {
//         game.startNightPhase();
//         return;
//     }
//
//     if (message.content.startsWith("!") && game) {
//         const command = Command.parse(message.content, game);
//         const player = game.getPlayer(message.author.id);
//
//         if (command && player) {
//             if (command.type === RecognisedCommands.Lynch && command.target instanceof Player) {
//                 player.accuse(command.target);
//                 return;
//             }
//
//             player.role.action(command);
//         }
//     }
// });
