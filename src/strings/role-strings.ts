export default {
    villager: {
        description: `You are a villager and must find and eliminate the werewolves.`,
        imageUrl: `https://media.discordapp.net/attachments/663423717753225227/663469766253608999/villager_t.png`,
        winCondition: `You are on the **Villagers** team. You win if all the werewolves are eliminated.`,
    },
    werewolf: {
        description:
            "You are a werewolf and learn the identity of any other werewolves. Every night after the first, you may choose a player to kill. You will be notified of what targets your fellow werewolves have chosen as well. The player with the most werewolves targeting them will be eliminated next morning. You are not allowed to target other werewolves.",
        imageUrl: `https://media.discordapp.net/attachments/663423717753225227/663484398188101694/werewolf_t.png`,
        winCondition: `You are on the **Werewolves** team. You win if the number of living werewolves equals or exceeds the number of living villagers.`,
    },
    seer: {
        description:
            "You are a seer and have the special ability to, once per night, inspect a player to learn if they are a werewolf. Your existence is a threat to the werewolves, so take care to not reveal yourself too carelessly.",
        imageUrl: `https://media.discordapp.net/attachments/662393786638532609/663489597925490758/seer.png`,
    },
};
