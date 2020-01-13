import Game from "./structs/game";
import { generatePlayer } from "./test/fixtures/generate";
import Werewolf from "./roles/werewolf";
import Seer from "./roles/seer";
import Villager from "./roles/villager";
import Player from "./structs/player";
import Command from "./structs/command";

function privateMessage(player: Player, string: string): void {
    if (string !== undefined) {
        console.log(`Awoo to ${player.name}:: ${string}`);
    }
}
function publicMessage(string: string): void {
    console.log(`Awoo:: ${string}`);
}

// Clear the console.
console.clear();

// Generate game
const game = new Game({
    id: "12345",
    send: publicMessage,
    sendNotification: publicMessage,
});

// Generate players
const player0 = generatePlayer("0", "DaMonsterMonster", game, (message: string) => privateMessage(player0, message));
const player1 = generatePlayer("1", "Phar", game, (message: string) => privateMessage(player1, message));
const player2 = generatePlayer("2", "cainsith", game, (message: string) => privateMessage(player2, message));
const player3 = generatePlayer("3", "StealthFoxy", game, (message: string) => privateMessage(player3, message));
const player4 = generatePlayer("4", "Sinsorium", game, (message: string) => privateMessage(player4, message));
const player5 = generatePlayer("5", "TheCanadian", game, (message: string) => privateMessage(player5, message));
const player6 = generatePlayer("6", "Noire", game, (message: string) => privateMessage(player6, message));
const player7 = generatePlayer("7", "Werewolf Gene", game, (message: string) => privateMessage(player7, message));
const player8 = generatePlayer("8", "Allie223", game, (message: string) => privateMessage(player8, message));
const player9 = generatePlayer("9", "Peat", game, (message: string) => privateMessage(player9, message));

// Assign roles.
{
    player0.role = new Werewolf(
        player0,
        () => "You are a werewolf.",
        () => {
            if (game.day !== 1) return "You can target players to eliminate.";
        },
    );
    player1.role = new Werewolf(
        player1,
        () => "You are a werewolf.",
        () => {
            if (game.day !== 1) return "You can target players to eliminate.";
        },
    );
    player2.role = new Seer(
        player2,
        () => "You are a seer.",
        () => "You can target players to inspect.",
    );
    player3.role = new Villager(player3, () => "You are a villager.");
    player4.role = new Villager(player4, () => "You are a villager.");
    player5.role = new Villager(player5, () => "You are a villager.");
    player6.role = new Villager(player6, () => "You are a villager.");
    player7.role = new Villager(player7, () => "You are a villager.");
    player8.role = new Villager(player8, () => "You are a villager.");
    player9.role = new Villager(player9, () => "You are a villager.");
}

// Add players to game.
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

console.log("\n========= NIGHT ONE =========\n");
// Start game.
game.startFirstNight();

// Seer inspects a villager.
(player2.role as Seer).actionHandler(new Command("target", ["TheCanadian"]));
// They attempt to inspect another player, but it doesn't work.
(player2.role as Seer).actionHandler(new Command("target", ["Phar"]));

// Werewolf attempts to target someone on the first night and fails.
(player1.role as Werewolf).actionHandler(new Command("target", ["TheCanadian"]));

console.log("\n========= DAY ONE =========\n");
// *************** Day 1 ******************
game.startDay();

// Players start accusing people of being a werewolf.
player0.accuse(new Command("accuse", ["Canadian"]));
player1.accuse(new Command("accuse", ["Canadian"]));
player2.accuse(new Command("accuse", ["Canadian"]));
player3.accuse(new Command("accuse", ["Phar"]));
player4.accuse(new Command("accuse", ["Canadian"]));
player5.accuse(new Command("accuse", ["StealthFoxy"]));

console.log("\n========= NIGHT TWO =========\n");
// *************** Night 2 ******************
game.startNight();

// Player 5 should be lynched.
console.log(player5.alive);

// Seer inspects the same villager from last night.
(player2.role as Seer).actionHandler(new Command("target", ["TheCanadian"]));
// They attempt to inspect another player, but it works because they already inspected the previous one.
(player2.role as Seer).actionHandler(new Command("target", ["Stealth"]));

// Werewolves target someone.
(player1.role as Werewolf).actionHandler(new Command("target", ["Sin"]));
(player0.role as Werewolf).actionHandler(new Command("target", ["Sinsorium"]));

console.log("\n========= DAY TWO =========\n");
// *************** Day 2 ******************
game.startDay();

// Players start accusing people of being a werewolf, but tie.
player0.accuse(new Command("accuse", ["cainsith"]));
player1.accuse(new Command("accuse", ["cainsith"]));
player2.accuse(new Command("accuse", ["Phar"]));
player3.accuse(new Command("accuse", ["Phar"]));

// Player 4 and 5 is dead and doesn't count their accusation.
player4.accuse(new Command("accuse", ["Canadian"]));
player5.accuse(new Command("accuse", ["Canadian"]));

console.log("\n========= NIGHT THREE =========\n");
// *************** Night 3 ******************
game.startNight();

// No body should be lynched.
(player2.role as Seer).actionHandler(new Command("target", ["Cain"]));
(player2.role as Seer).actionHandler(new Command("target", ["phar"]));

// Werewolves target someone.
(player1.role as Werewolf).actionHandler(new Command("target", ["peat"]));

console.log("\n========= DAY THREE =========\n");
// *************** Day 3 ******************
game.startDay();

// Players start accusing people of being a werewolf.
player0.accuse(new Command("accuse", ["gene"]));
player1.accuse(new Command("accuse", ["gene"]));
player2.accuse(new Command("accuse", ["werewolf"]));
player3.accuse(new Command("accuse", ["gene"]));

// Player can't target themselves!
player1.accuse(new Command("accuse", ["cainsith"]));

console.log("\n========= NIGHT FOUR =========\n");
// *************** Night 4 ******************
game.startNight();

(player2.role as Seer).actionHandler(new Command("target", ["noire"]));

// Werewolves target someone.
(player0.role as Werewolf).actionHandler(new Command("target", ["allie"]));
(player1.role as Werewolf).actionHandler(new Command("target", ["Allie"]));

console.log("\n========= DAY FOUR =========\n");
// *************** Day 3 ******************
game.startDay();

// Players start accusing people of being a werewolf.
player0.accuse(new Command("accuse", ["stealth"]));
player2.accuse(new Command("accuse", ["stealth"]));
player3.accuse(new Command("accuse", ["stealth"]));
player6.accuse(new Command("accuse", ["stealth"]));
player7.accuse(new Command("accuse", ["stealth"]));

// Player can't accuse since their dead!
player1.accuse(new Command("accuse", ["cainsith"]));

console.log("\n========= NIGHT FIVE =========\n");
// *************** Night 5 ******************
game.startNight();

// Should be over now.
