import { Client, TextChannel } from "discord.js";
import * as Env from "dotenv";
import { dayEmbed, nightEmbed } from "./templates/embed-templates";
// import Player from "./structs/player";
import Game from "./structs/game";
import Phase from "./structs/phase";
// import * as Manager from "./manager-functions";

console.clear();

const result = Env.config();
if (result.error) {
    throw result.error;
}

const client = new Client();
client.login(process.env.DISCORD_BOT_TOKEN)
    .catch((err) => { console.error(err); });

client.on("message", (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("#!test")) {
        // const testWerewolf = [
        //     new Player(message.member, new Game(message.channel as TextChannel)),
        //     new Player(message.guild.me, new Game(message.channel as TextChannel)),
        // ];
        const game = new Game(message.channel as TextChannel, {
            phase: Phase.Day,
            day: 3,
            active: true
        });

        // message.channel.send(villagerRoleEmbed(message.guild));
        // message.channel.send(werewolfRoleEmbed(message.guild, testWerewolf));
        // message.channel.send(seerRoleEmbed(message.guild));
        // message.channel.send(bodyguardRoleEmbed(message.guild));
        // message.channel.send(hunterRoleEmbed(message.guild));
        // message.channel.send(lycanRoleEmbed(message.guild));
        // message.channel.send(mayorRoleEmbed(message.guild));
        // message.channel.send(tannerRoleEmbed(message.guild));
        // message.channel.send(sorceressRoleEmbed(message.guild));
        // message.channel.send(witchRoleEmbed(message.guild));
        // message.channel.send(insomniacRoleEmbed(message.guild));
        // message.channel.send(minionRoleEmbed(message.guild, testWerewolf));
        // message.channel.send(apprenticeSeerRoleEmbed(message.guild));
        // message.channel.send(loneWolfRoleEmbed(message.guild, testWerewolf));
        // message.channel.send(masonRoleEmbed(message.guild, testWerewolf));
        // message.channel.send(drunkRoleEmbed(message.guild));
        // message.channel.send(doppelgangerRoleEmbed(message.guild));

        message.channel.send(dayEmbed(game));
        message.channel.send(nightEmbed(game));
    }
});
