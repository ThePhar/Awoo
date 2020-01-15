import { Client, Message, RichEmbed, TextChannel } from "discord.js";
import Command from "./structs/command";
import Game from "./structs/game";
import RecognisedCommands from "./structs/recognised-commands";
import Player from "./structs/player";
import Villager from "./roles/villager";
import { lobby, playerJoined, playerLeft } from "./embeds/game-events";
import {
    bodyguardRole,
    hunterRole,
    lycanRole,
    mayorRole,
    seerRole,
    sorceressRole,
    tannerRole,
    villagerRole,
    werewolfRole,
    witchRole,
} from "./embeds/roles";
import Werewolf from "./roles/werewolf";
import {
    bodyguardNightAction,
    hunterNightAction,
    seerNightAction,
    sorceressNightAction,
    werewolfNightAction,
    witchNightAction,
} from "./embeds/night-actions";
import Seer from "./roles/seer";
import Lycan from "./roles/lycan";
import Hunter from "./roles/hunter";
import Mayor from "./roles/mayor";
import Witch from "./roles/witch";
import Tanner from "./roles/tanner";
import Bodyguard from "./roles/bodyguard";
import Sorceress from "./roles/sorceress";
import Phases from "./structs/phases";
import schedule from "node-schedule";
import { getNextMorning, getNextNight } from "./util/date";
import shuffle from "./util/shuffle";

const client = new Client();
client.login("NjYxMDIwNDEzMDUyMDU5Njg5.XhzDBA.hukkqm7l0GMaIJt6lMEeAt08Gro");

const notificationChannel = "664620246346498079";
const discussionChannel = "661018922039902218";
const playersRole = "662067288337416205";

let game: Game;
let lobbyMessage: Message;
let scheduled: schedule.Job | undefined;

function debugCommands(message: Message): void {
    if (message.content === "#!startDay") {
        game.startDay();
    } else if (message.content === "#!startNight") {
        game.startNight();
    } else if (message.content === "#!startFirstNight") {
        game.startFirstNight();
    } else if (message.content === "#!role") {
        game.sendAllPlayerRoles();
    } else if (message.content === "#!action") {
        game.sendAllPlayerNightActions();
    } else if (message.content === "#!assign vil") {
        const player = game.players[0] as Player;
        player.role = new Villager(player, () => villagerRole());
    } else if (message.content === "#!assign wer") {
        const player = game.players[0] as Player;
        player.role = new Werewolf(
            player,
            () => werewolfRole(game),
            () => werewolfNightAction(game),
        );
    } else if (message.content === "#!assign see") {
        const player = game.players[0] as Player;
        player.role = new Seer(
            player,
            () => seerRole(),
            () => seerNightAction(player, game),
        );
    } else if (message.content === "#!assign lyc") {
        const player = game.players[0] as Player;
        player.role = new Lycan(player, () => lycanRole());
    } else if (message.content === "#!assign hun") {
        const player = game.players[0] as Player;
        player.role = new Hunter(
            player,
            () => hunterRole(),
            () => hunterNightAction(player, game),
        );
    } else if (message.content === "#!assign may") {
        const player = game.players[0] as Player;
        player.role = new Mayor(player, () => mayorRole());
    } else if (message.content === "#!assign wit") {
        const player = game.players[0] as Player;
        player.role = new Witch(
            player,
            () => witchRole(),
            () => witchNightAction(player, game),
        );
    } else if (message.content === "#!assign tan") {
        const player = game.players[0] as Player;
        player.role = new Tanner(player, () => tannerRole());
    } else if (message.content === "#!assign bod") {
        const player = game.players[0] as Player;
        player.role = new Bodyguard(
            player,
            () => bodyguardRole(),
            () => bodyguardNightAction(game),
        );
    } else if (message.content === "#!assign sor") {
        const player = game.players[0] as Player;
        player.role = new Sorceress(
            player,
            () => sorceressRole(),
            () => sorceressNightAction(player, game),
        );
    }
}

client.on("ready", async () => {
    const nChannel = (await client.channels.get(notificationChannel)) as TextChannel;
    const dChannel = (await client.channels.get(discussionChannel)) as TextChannel;

    game = new Game({
        id: "1",
        send: (content: unknown): void => {
            dChannel.send(content);
        },
        sendNotification: (content: unknown): Promise<Message | Message[]> => {
            dChannel.send(content);
            return nChannel.send(content);
        },
    });

    // lobbyMessage = await game.sendNotification(lobby(game.players));

    // Because the bot crashed, let's reset the game state.
    const client0 = await client.fetchUser("196473225268428804"); // Phar
    const client1 = await client.fetchUser("91704510598090752"); // Noire
    const client2 = await client.fetchUser("411711452286550017"); // Ender
    const client3 = await client.fetchUser("170788688916250624"); // Sinsorium
    const client4 = await client.fetchUser("561330752701333543"); // NetGlow
    const client5 = await client.fetchUser("310191755964448768"); // ZombieDR
    const client6 = await client.fetchUser("223629278242275328"); // Canadian
    const client7 = await client.fetchUser("327595206771736586"); // Tericonix
    const client8 = await client.fetchUser("151839470369505280"); // cain
    const client9 = await client.fetchUser("169939014424592384"); // Peat
    const client10 = await client.fetchUser("173401560485724160"); // Stealth

    const player0 = new Player({
        name: client0.tag,
        game: game,
        id: client0.id,
        send: (content: unknown): void => {
            client0.send(content);
        },
    });
    const player1 = new Player({
        name: client1.tag,
        game: game,
        id: client1.id,
        send: (content: unknown): void => {
            client1.send(content);
        },
    });
    const player2 = new Player({
        name: client2.tag,
        game: game,
        id: client2.id,
        send: (content: unknown): void => {
            client2.send(content);
        },
    });
    const player3 = new Player({
        name: client3.tag,
        game: game,
        id: client3.id,
        send: (content: unknown): void => {
            client3.send(content);
        },
    });
    const player4 = new Player({
        name: client4.tag,
        game: game,
        id: client4.id,
        send: (content: unknown): void => {
            client4.send(content);
        },
    });
    const player5 = new Player({
        name: client5.tag,
        game: game,
        id: client5.id,
        send: (content: unknown): void => {
            client5.send(content);
        },
    });
    const player6 = new Player({
        name: client6.tag,
        game: game,
        id: client6.id,
        send: (content: unknown): void => {
            client6.send(content);
        },
    });
    const player7 = new Player({
        name: client7.tag,
        game: game,
        id: client7.id,
        send: (content: unknown): void => {
            client7.send(content);
        },
    });
    const player8 = new Player({
        name: client8.tag,
        game: game,
        id: client8.id,
        send: (content: unknown): void => {
            client8.send(content);
        },
    });
    const player9 = new Player({
        name: client9.tag,
        game: game,
        id: client9.id,
        send: (content: unknown): void => {
            client9.send(content);
        },
    });
    const player10 = new Player({
        name: client10.tag,
        game: game,
        id: client10.id,
        send: (content: unknown): void => {
            client10.send(content);
        },
    });

    player0.role = new Villager(player0, () => villagerRole());
    player1.role = new Sorceress(
        player1,
        () => sorceressRole(),
        () => sorceressNightAction(player1, game),
    );
    player2.role = new Villager(player2, () => villagerRole());
    player3.role = new Lycan(player3, () => lycanRole());
    player4.role = new Bodyguard(
        player4,
        () => bodyguardRole(),
        () => bodyguardNightAction(game),
    );
    player5.role = new Villager(player5, () => villagerRole());
    player6.role = new Seer(
        player6,
        () => seerRole(),
        () => seerNightAction(player6, game),
    );
    player7.role = new Hunter(
        player7,
        () => hunterRole(),
        () => hunterNightAction(player7, game),
    );
    player8.role = new Werewolf(
        player8,
        () => werewolfRole(game),
        () => werewolfNightAction(game),
    );
    player9.role = new Werewolf(
        player9,
        () => werewolfRole(game),
        () => werewolfNightAction(game),
    );
    player10.role = new Mayor(player10, () => mayorRole());

    game.addPlayer(player0);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
    game.addPlayer(player5);
    game.addPlayer(player6);
    game.addPlayer(player7);
    game.addPlayer(player8);
    game.addPlayer(player9);
    game.addPlayer(player10);

    // Tell players 7 and 10 their new roles.
    // player7.send(
    //     "Because Phar is a dumbass, he's elected to commit suicide since he needed to look at everyone's role to bring the bot back online. To add some spice to the game, he also decided to randomly add a couple roles back in the mix. You were randomly chosen to be a Hunter instead.",
    // );
    // player10.send(
    //     "Because Phar is a dumbass, he's elected to commit suicide since he needed to look at everyone's role to bring the bot back online. Since his role would go to waste, he randomly assigned his role to you. You were randomly chosen to be a Mayor instead.",
    // );
    //
    // player7.sendRole();
    // player10.sendRole();

    player0.alive = false;

    // game.sendNotification(
    //     new RichEmbed()
    //         .setTitle("Phar#7166 is Eliminated (by too much knowledge (and being dumb))")
    //         .setDescription(
    //             "> How it happened, no body knows. It seems he looked to far into the matrix and lost his mind.\n\nPhar has been eliminated (because he now knows too much.) Feel free to message him if you have questions about the game however.",
    //         )
    //         .setColor(0xff0000),
    // );

    game.day = 1;
    game.active = true;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    startDay();

    // game.sendNotification(
    //     new RichEmbed().setDescription("A random villager has also become a hunter. Be careful who you eliminate."),
    // );
});

function initGame(): void {
    // Assign roles
    const players = shuffle(game.players);

    for (const player of players) {
        player.role = new Villager(player, () => villagerRole());
    }

    // Set seer
    players[0].role = new Seer(
        players[0],
        () => seerRole(),
        () => seerNightAction(players[0], game),
    );
    // Set initial werewolf
    players[1].role = new Werewolf(
        players[1],
        () => werewolfRole(game),
        () => werewolfNightAction(game),
    );

    if (players.length === 7) {
        players[2].role = new Lycan(players[2], () => lycanRole());
    } else if (players.length === 8) {
        players[2].role = new Lycan(players[2], () => lycanRole());
        players[3].role = new Sorceress(
            players[3],
            () => sorceressRole(),
            () => sorceressNightAction(players[3], game),
        );
    }

    if (players.length >= 9) {
        players[2].role = new Werewolf(
            players[2],
            () => werewolfRole(game),
            () => werewolfNightAction(game),
        );
        players[3].role = new Sorceress(
            players[3],
            () => sorceressRole(),
            () => sorceressNightAction(players[3], game),
        );
        players[4].role = new Bodyguard(
            players[4],
            () => bodyguardRole(),
            () => bodyguardNightAction(game),
        );
    }
    if (players.length >= 10) {
        players[5].role = new Mayor(players[5], () => mayorRole());
    }
    if (players.length >= 11) {
        players[6].role = new Lycan(players[6], () => lycanRole());
    }
    if (players.length >= 12) {
        players[7].role = new Werewolf(
            players[7],
            () => werewolfRole(game),
            () => werewolfNightAction(game),
        );
        players[8].role = new Hunter(
            players[8],
            () => hunterRole(),
            () => hunterNightAction(players[8], game),
        );
        players[9].role = new Witch(
            players[9],
            () => witchRole(),
            () => witchNightAction(players[9], game),
        );
    }
    if (players.length >= 13) {
        players[10].role = new Tanner(players[10], () => tannerRole());

        const extraWerewolves = Math.floor((players.length - 13) / 6);
        for (let i = 0; i < extraWerewolves; i++) {
            players[11 + i].role = new Werewolf(
                players[11 + i],
                () => werewolfRole(game),
                () => werewolfNightAction(game),
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    scheduled = schedule.scheduleJob(getNextMorning().toDate(), startDay);
    game.startFirstNight();
}
function startDay(): void {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    scheduled = schedule.scheduleJob(getNextNight().toDate(), startNight);
    game.startDay();
}
function startNight(): void {
    scheduled = schedule.scheduleJob(getNextMorning().toDate(), startDay);
    game.startNight();
}

client.on("message", message => {
    if (message.author.bot) return;
    if (!game) return;
    if (message.channel.id !== discussionChannel && message.channel.type !== "dm") return;

    debugCommands(message);

    if (message.channel.id === discussionChannel) {
        if (game.phase === Phases.Night) {
            message.delete();
            return;
        }

        if (message.content.startsWith(Command.prefix)) {
            const command = Command.parse(message.content);
            const player = game.getPlayers(message.author.id)[0];

            if (player && command && command.type === RecognisedCommands.Leave && !game.active) {
                game.removePlayer(player);
                game.send(playerLeft(player));
                lobbyMessage.edit(lobby(game.players));

                if (game.players.length < 6 && scheduled) {
                    scheduled.cancel();
                    scheduled = undefined;
                }
            }

            if (player && command && command.type === RecognisedCommands.Accuse) {
                player.accuse(command);
            } else if (!player && game.active) {
                message.delete();
                return;
            } else if (!player && command && command.type === RecognisedCommands.Join && !game.active) {
                const player = new Player({
                    send: (content: unknown): void => {
                        message.author.send(content);
                    },
                    game: game,
                    name: message.author.tag,
                    id: message.author.id,
                });

                game.addPlayer(player);
                game.send(playerJoined(player));
                lobbyMessage.edit(lobby(game.players));

                if (game.players.length >= 6 && !scheduled) {
                    scheduled = schedule.scheduleJob(getNextNight().toDate(), initGame);
                }
            } else if (!player) {
                if (game.phase !== Phases.WaitingForPlayers) {
                    message.delete();
                    return;
                }
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
