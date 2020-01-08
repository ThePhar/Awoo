/* eslint-disable prettier/prettier */
import RecognisedCommands from "../structs/recognised-commands";
import Command from "../structs/command";

const RoleStrings = {
    villager: {
        name: "Villager",
        appearance: "villager",
        description: "You are an average villager. Find the werewolves and eliminate them.",
        thumbnailUrl: "https://media.discordapp.net/attachments/663423717753225227/663469766253608999/villager_t.png",
        winCondition: "You are on the **Villagers** team. You win if all the werewolves are eliminated.",
        nightCommands: "*You have no night actions. Sweet dreams~!*",
        dayCommands: [
            `▹ ${Command.getCode(RecognisedCommands.Accuse, ["name"])}\nAccuse a player of being a werewolf.\n`
        ]
    },
    werewolf: {
        name: "Werewolf",
        nightName: "On The Dinner Menu",
        appearance: "werewolf",
        description: "You are a werewolf and learn the identity of any other werewolves. Every night after the first, you may target a player to eliminate. You will also be notified when one of your fellow werewolves makes a target as well. The player with the most werewolves targeting them will be eliminated next morning. You are not allowed to target other werewolves.",
        nightDescription: `Target a player to eliminate from the list below using ${Command.getCode(RecognisedCommands.Target, ["name"])}. Remember, only the player with the most werewolves targeting them will be eliminated. If there's a tie, no one will be eliminated.`,
        thumbnailUrl: "https://media.discordapp.net/attachments/663423717753225227/663484398188101694/werewolf_t.png",
        winCondition: "You are on the **Werewolves** team. You win if the number of living werewolves meet or exceed the number of living villagers.",
        nightCommands: [
            `▹ ${Command.getCode(RecognisedCommands.Target, ["name"])}\nTarget a player to eliminate.\n`
        ],
    },
    seer: {
        name: "Seer",
        nightName: "Look Into The Crystal Ball",
        description: "You are a seer and have the special ability to, once per night, inspect a player to learn if they are a werewolf. Your existence is a threat to the werewolves, so take care not to reveal yourself too carelessly.",
        nightDescription: `It's time to peer into the true nature of one of your fellow villagers. Target a player from the list below using ${Command.getCode(RecognisedCommands.Target, ["name"])} to learn if they are a werewolf.`,
        thumbnailUrl: "https://media.discordapp.net/attachments/662393786638532609/663489597925490758/seer.png",
        nightCommands: [
            `▹ ${Command.getCode(RecognisedCommands.Target, ["name"])}\nTarget a player to inspect.\n`
        ],
    },
};

export default RoleStrings;
