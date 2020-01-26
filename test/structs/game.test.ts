import * as Discord from "discord.js";
import * as Fixture from "../fixtures/guild-member";

import Game   from "../../src/structs/game";
import Phase  from "../../src/structs/phase";
import Player from "../../src/structs/player";
import { createMember } from "../fixtures/guild-member";
import { createTextChannel } from "../fixtures/text-channel";

let game: Game, channel: Discord.TextChannel;
beforeEach(() => {
    channel = createTextChannel();
    game = new Game(channel);
});

// describe("Old Tests", () => {
//     describe("initializeGame()", () => {
//         test("Should send role information to every single player.", () => {
//             const member1 = createMember("1", "Test");
//             const member2 = createMember("2", "Test");
//
//             game.addPlayer(member1);
//             game.addPlayer(member2);
//
//             game.initializeGame();
//
//             expect((member1.send as jest.Mock).mock.calls[0][0].title
//                 .includes("You are a"))
//                 .toBe(true);
//             expect((member2.send as jest.Mock).mock.calls[0][0].title
//                 .includes("You are a"))
//                 .toBe(true);
//         });
//     });
//     describe("startDayPhase()", () => {
//         beforeEach(() => {
//             game = new Game(channel, { active: true, day: 1, phase: Phase.Night });
//             game.addPlayer(createMember("1", "Test"));
//             game.addPlayer(createMember("2", "Test"));
//             game.addPlayer(createMember("3", "Test"));
//             game.addPlayer(createMember("4", "Test"));
//
//             const werewolf = game.addPlayer(createMember("5", "TestWere")) as Player;
//             werewolf.role = new Werewolf(werewolf);
//         });
//
//         test("Should only set the phase to day.", () => {
//             game.startDayPhase();
//
//             expect(game.phase).toBe(Phase.Day);
//             expect(game.day).toBe(1);
//             expect(game.active).toBe(true);
//         });
//         test("Should send a new day notification if no win condition was met.", () => {
//             game.startDayPhase();
//
//             expect((channel.send as jest.Mock).mock.calls[0][0].title)
//                 .toBe("Start of Day 1");
//         });
//         test("Should not run elimination logic on day 1", () => {
//             game.processWerewolfElimination = jest.fn();
//             game.processWitchElimination = jest.fn();
//             game.processHunterElimination = jest.fn();
//
//             game.startDayPhase();
//
//             expect(game.processWerewolfElimination).not.toHaveBeenCalled();
//             expect(game.processWitchElimination).not.toHaveBeenCalled();
//             expect(game.processHunterElimination).not.toHaveBeenCalled();
//         });
//         test("Should run elimination logic after day 1", () => {
//             game.day = 2;
//
//             game.processWerewolfElimination = jest.fn();
//             game.processWitchElimination = jest.fn();
//             game.processHunterElimination = jest.fn();
//
//             game.startDayPhase();
//
//             expect(game.processWerewolfElimination).toHaveBeenCalled();
//             expect(game.processWitchElimination).toHaveBeenCalled();
//             expect(game.processHunterElimination).toHaveBeenCalled();
//         });
//     });
//     describe("startNightPhase()", () => {
//         beforeEach(() => {
//             game = new Game(channel, { active: true, day: 1, phase: Phase.Day });
//
//             game.addPlayer(createMember("10", "Test"));
//             game.addPlayer(createMember("11", "Test"));
//             game.addPlayer(createMember("12", "Test"));
//             game.addPlayer(createMember("13", "Test"));
//             const werewolf = game.addPlayer(createMember("14", "TestWere")) as Player;
//             werewolf.role = new Werewolf(werewolf);
//         });
//
//         test("Should set the phase to night and increment day.", () => {
//             game.startNightPhase();
//
//             expect(game.phase).toBe(Phase.Night);
//             expect(game.day).toBe(2);
//             expect(game.active).toBe(true);
//         });
//         test("Should clear all accusations made by players.", () => {
//             const player1 = game.addPlayer(Fixture.createMember("1", "Test")) as Player;
//             const player2 = game.addPlayer(
//                 Fixture.createMember("2", "Test"), { accusing: player1, alive: true }) as Player;
//
//             game.startNightPhase();
//
//             expect(player2.accusing).toBeNull();
//         });
//         test("Should send a new day notification if no win condition was met.", () => {
//             game.startNightPhase();
//
//             expect((channel.send as jest.Mock).mock.calls[1][0].title)
//                 .toBe("Start of Night 2");
//         });
//
//         test("Should eliminate a player with the most accusations.", () => {
//             const accusedPlayer = game.addPlayer(createMember("1", "Accused")) as Player;
//             const secondPlayer  = game.addPlayer(createMember("2", "Second")) as Player;
//             const accuseState1 = { accusing: accusedPlayer, alive: true };
//             const accuseState2 = { accusing: secondPlayer, alive: true };
//
//             game.addPlayer(createMember("3", "Test"), accuseState1);
//             game.addPlayer(createMember("4", "Test"), accuseState1);
//             game.addPlayer(createMember("5", "Test"), accuseState1);
//             game.addPlayer(createMember("6", "Test"), accuseState2);
//             game.addPlayer(createMember("7", "Test"), accuseState2);
//
//             game.startNightPhase();
//             expect(accusedPlayer.alive).toBe(false);
//             expect(secondPlayer.alive).toBe(true);
//         });
//         test("Should not eliminate a player if there is a tie.", () => {
//             const accusedPlayer = game.addPlayer(createMember("1", "Accused")) as Player;
//             const secondPlayer  = game.addPlayer(createMember("2", "Second")) as Player;
//             const accuseState1 = { accusing: accusedPlayer, alive: true };
//             const accuseState2 = { accusing: secondPlayer, alive: true };
//
//             game.addPlayer(createMember("3", "Test"), accuseState1);
//             game.addPlayer(createMember("4", "Test"), accuseState1);
//             game.addPlayer(createMember("5", "Test"), accuseState2);
//             game.addPlayer(createMember("6", "Test"), accuseState2);
//
//             game.startNightPhase();
//             expect(accusedPlayer.alive).toBe(true);
//             expect(secondPlayer.alive).toBe(true);
//         });
//         test("Should not eliminate a player if there are no votes.", () => {
//             game.addPlayer(createMember("1", "Test"));
//             game.addPlayer(createMember("2", "Test"));
//             game.addPlayer(createMember("3", "Test"));
//
//             game.startNightPhase();
//             expect(game.players.alive.length).toBe(8);
//         })
//     });
//
//     describe("getPlayer()", () => {
//         test("Should return the player object of a particular id if it exists.", () => {
//             const member = Fixture.createMember("1", "Test");
//
//             const instantiatedPlayer = game.addPlayer(member);
//             const fetchedPlayer = game.getPlayer(member.id);
//
//             expect(fetchedPlayer).toBe(instantiatedPlayer);
//         });
//         test("Should return undefined if a particular player does not exist.", () => {
//             const player = game.getPlayer("12345");
//
//             expect(player).toBeUndefined();
//         });
//     });
//     describe("removePlayer()", () => {
//         test("Should remove the player from the game and return the removed player object if it exists.", () => {
//             const member = Fixture.createMember("1", "Test");
//
//             const instantiatedPlayer = game.addPlayer(member);
//             const removedPlayer = game.removePlayer(member.id);
//
//             expect(removedPlayer).toBe(instantiatedPlayer);
//             expect(game.totalPlayers).toBe(0);
//             expect(game.getPlayer(member.id)).toBeUndefined();
//         });
//         test("Should return undefined if a particular player does not exist.", () => {
//             const player = game.removePlayer("12345");
//
//             expect(player).toBeUndefined();
//         });
//     });
//     describe("getPlayers()", () => {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         let player1, player2, player3, player4, player5, player6, player7, player8;
//         beforeEach(() => {
//             const deadState = { alive: false, accusing: null };
//
//             player1 = game.addPlayer(Fixture.createMember("1", "Test"))            as Player;
//             player2 = game.addPlayer(Fixture.createMember("2", "Test"))            as Player;
//             player3 = game.addPlayer(Fixture.createMember("3", "Test"))            as Player;
//             player4 = game.addPlayer(Fixture.createMember("4", "Test"))            as Player;
//             player5 = game.addPlayer(Fixture.createMember("5", "Test"))            as Player;
//             player6 = game.addPlayer(Fixture.createMember("6", "Test"))            as Player;
//             player7 = game.addPlayer(Fixture.createMember("7", "Test"), deadState) as Player;
//             player8 = game.addPlayer(Fixture.createMember("8", "Test"), deadState) as Player;
//
//             player4.role = new Werewolf(player4);
//             player5.role = new Werewolf(player5);
//         });
//
//         test("Should return an object with an array of all players.", () => {
//             expect(game.players.all.length).toBe(8);
//         });
//         test("Should return an object with an array of alive players.", () => {
//             expect(game.players.alive.length).toBe(6);
//         });
//         test("Should return an object with an array of dead players.", () => {
//             expect(game.players.dead.length).toBe(2);
//         });
//         test("Should return an object with an array of all alive werewolves.", () => {
//             expect(game.players.aliveWerewolves.length).toBe(2);
//         });
//         test("Should return an object with an array of all alive villagers (non-werewolves).", () => {
//             expect(game.players.aliveVillagers.length).toBe(4);
//         });
//     });
// });

/* Meta Functions */
describe("constructor(channel, state?)", () => {
    it("should have default state on instantiation without predefined state", () => {
        expect(game.active).toBe(false);
        expect(game.phase).toBe(Phase.Waiting);
        expect(game.day).toBe(0);
    });
    it("should have predefined state on instantiation with predefined state", () => {
        game = new Game(channel, {
            active: true,
            day: 3,
            phase: Phase.Day,
        });

        expect(game.active).toBe(true);
        expect(game.phase).toBe(Phase.Day);
        expect(game.day).toBe(3);
    });
});
describe("send(content)", () => {
    it("should send a message or embed to the notification channel for this guild via Discord API and return true", async () => {
        const success = await game.send("This is a test");

        expect(channel.send).toHaveBeenCalledWith("This is a test");
        expect(success).toBe(true);
    });
    it("should log a custom message if a RichEmbed was passed", () => {
        game.send(new Discord.RichEmbed()
            .setDescription("Hello, world!")
            .setTitle("Test Title")
            .setColor(0xff0000)
            .setImage("http://test.example/1.jpg")
        );
    });
    it("should log an error and continue if there was a problem sending a message via Discord API and return false", async () => {
        game = new Game(createTextChannel(() => { throw Error("Generic Test Error"); }));

        const success = await game.send("This is a test");
        expect(success).toBe(false);
    });
    it("should log a custom error message if there was a problem sending an embed", () => {
        game = new Game(createTextChannel(() => { throw Error("Generic Test Error"); }));

        game.send(new Discord.RichEmbed()
            .setDescription("Hello, world!")
            .setTitle("Test Title")
            .setColor(0xff0000)
            .setImage("http://test.example/1.jpg")
        );
    });
});

/* Player Functions */
describe("addPlayer(member, state?)", () => {
    let member: Discord.GuildMember,
        player: Player;
    beforeEach(() => {
        member = createMember("1", "Test");
        player = game.addPlayer(member);
    });

    it("should create and return a player object that was added to the game's player map, if player doesn't exist under a specified member", () => {
        expect(game.totalPlayers).toBe(1);
        expect(game.players.all[0]).toBe(player);
    });
    it("should return an existing player object, if player already exists under a specified member", () => {
        // Try to add our player again.
        player = game.addPlayer(member);

        expect(game.players.all.length).toBe(1);
        expect(game.players.all[0]).toBe(player);
    });
    it("should create and return a player object that was added to the game's players map with a predefined state", () => {
        member = Fixture.createMember("2", "Predefined");
        player = game.addPlayer(member, { accusing: null, alive: false });

        expect(game.totalPlayers).toBe(2);
        expect(player).toHaveProperty("alive", false);
    });
});
