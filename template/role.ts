/* eslint-disable max-len */
import dedent from "dedent";
import * as Discord from "discord.js";
import * as Roles from "../role";
import Role from "../interface/role";
import RecognisedCommand, { getCommand } from "../enum/recognised-command";
import Color from "../enum/color";
import Team from "../enum/team";
import Tip from "./tips";

const villagerThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png";
const seerThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427035228307493/seer.png";
const werewolfThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427025887854596/werewolf_t.png";
const mayorThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427033936592924/mayor.png";
const lycanThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427032007344149/lycan.png";
const bodyguardThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427028823605258/bodyguard.png";
const tannerThumbnail = "https://cdn.discordapp.com/attachments/663423717753225227/666427021949141035/tanner.png";
const princeThumbnail = "https://cdn.discordapp.com/attachments/429907716165730308/705540425573859378/prince.png";
const sorceressThumbnail =
    "https://media.discordapp.net/attachments/663423717753225227/666427037384441856/sorceress.png";
const masonThumbnail = "https://cdn.discordapp.com/attachments/429907716165730308/668771401028861962/mason.png";
const hunterThumbnail = "https://media.discordapp.net/attachments/663423717753225227/666427030245736472/hunter.png";
const witchThumbnail = "https://media.discordapp.net/attachments/663423717753225227/666427027389415444/witch.png";

/* Helper Functions */
function generateObjectiveFields(role: Role) {
    let team = `**${role.team}**`;
    let objective;

    if (role.team === Team.Villagers) {
        objective = "Find the werewolves and eliminate them.";
    } else if (role.team === Team.Werewolves) {
        objective = "Eliminate the villagers until living werewolves outnumber the remaining villagers.";
    } else if (role.team === Team.Tanner) {
        objective = "Get eliminated to win.";
        team = "You are your own team.";
    }

    return [
        { name: "Objective", value: objective, inline: true },
        { name: "Team", value: team, inline: true },
        {
            name: "During the Day Phase",
            value: dedent(`
        During the day, type ${getCommand(RecognisedCommand.Accuse)} in ${
                role.game.channel
            } to accuse a player of being a Werewolf.
            
        When the day phase ends, the player with the most accusations will be eliminated. In the event of a tie, no player will be eliminated.
      `),
        },
    ];
}
function safeArray(array: any[]): any[] {
    if (array.length === 0) {
        return ["**-**"];
    }

    return array;
}

/* Villager */
export function RoleVillager(role: Roles.Villager) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Villager")
        .setDescription(
            dedent(`
      You are a villager and must find the werewolves and eliminate them.
    `),
        )
        .setThumbnail(villagerThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role));
}

/* Seer */
export function RoleSeer(role: Roles.Seer) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Seer")
        .setDescription(
            dedent(`
      You are a seer and can learn the identity of any player at night. Take care to protect your identity however, as you are the largest threat to the werewolves.
    `),
        )
        .setThumbnail(seerThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role))
        .addField(
            "During the Night Phase",
            dedent(`
        During the night, you will receive a prompt via DM to select a player to inspect. You can change your selection at any point during the night, but you must confirm a selection or you will forfeit your action.
            
        When the night phase ends, if you were not eliminated, you will receive a message with information on the player you chose to inspect. If you were eliminated, you will learn nothing.
      `),
        );
}
export function ActionSeer(role: Roles.Seer) {
    const target = role.target ? role.target : "*You are not targeting any player.*";
    const prompts = ["⬆️ `Previous Player`", "⬇️ `Next Player`", "✅ `Target Selected Player`"];

    // Get a list of all players we have already inspected.
    const inspected = [...role.inspected.entries()].map(
        ([, player]) => `${player.name} was a ${player.role.appearance}.`,
    );
    const available = role.availableToInspect.map((player, index) => {
        const selection = index === role.inspectIndex ? "🟦" : "⬜";

        return `${selection} ${player.toTextString()}`;
    });

    if (available.length > 0) {
        return new Discord.MessageEmbed()
            .setTitle("Look into the Crystal Ball")
            .setDescription(
                dedent(`
        Choose a player to check their role. If you survive the night, you will learn if they are a villager or a werewolf.
      `),
            )
            .setThumbnail(seerThumbnail)
            .setColor(Color.VillagerBlue)
            .setAuthor(role.game)
            .setFooter(Tip())
            .addFields([
                { name: "Currently Targeting", value: target },
                { name: "Available Targets", value: safeArray(available), inline: true },
                { name: "Previously Inspected", value: safeArray(inspected), inline: true },
                { name: "Prompts", value: prompts, inline: true },
            ]);
    }

    return new Discord.MessageEmbed()
        .setTitle("Information")
        .setDescription(
            "You have inspected all the players you could inspect. Only thing left to do is sit and hope for the best.",
        )
        .setThumbnail(seerThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields([{ name: "Previously Inspected", value: safeArray(inspected), inline: true }]);
}

/* Sorceress */
export function RoleSorceress(role: Roles.Sorceress) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Sorceress")
        .setDescription(
            dedent(`
      You are a sorceress and can learn if any player in a Seer at night. You are allied with the werewolves. Find the Seer and get them eliminated.
    `),
        )
        .setThumbnail(sorceressThumbnail)
        .setColor(Color.WerewolfRed)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role))
        .addField(
            "During the Night Phase",
            dedent(`
        During the night, you will receive a prompt via DM to select a player to inspect. You can change your selection at any point during the night, but you must confirm a selection or you will forfeit your action.
            
        When the night phase ends, if you were not eliminated, you will receive a message with information on the player you chose to inspect. If you were eliminated, you will learn nothing.
      `),
        );
}
export function ActionSorceress(role: Roles.Sorceress) {
    const target = role.target ? role.target : "*You are not targeting any player.*";
    const prompts = ["⬆️ `Previous Player`", "⬇️ `Next Player`", "✅ `Target Selected Player`"];

    // Get a list of all players we have already inspected.
    const inspected = [...role.inspected.entries()].map(
        ([, player]) => `${player.name} is ${player.role instanceof Roles.Seer ? "" : "not"} a Seer.`,
    );
    const available = role.availableToInspect.map((player, index) => {
        const selection = index === role.inspectIndex ? "🟦" : "⬜";

        return `${selection} ${player.toTextString()}`;
    });

    if (available.length > 0) {
        return new Discord.MessageEmbed()
            .setTitle("Look into the Crystal Orb")
            .setDescription(
                dedent(`
        Choose a player to check their role. If you survive the night, you will learn if they are a villager or a werewolf.
      `),
            )
            .setThumbnail(sorceressThumbnail)
            .setColor(Color.WerewolfRed)
            .setAuthor(role.game)
            .setFooter(Tip())
            .addFields([
                { name: "Currently Targeting", value: target },
                { name: "Available Targets", value: safeArray(available), inline: true },
                { name: "Previously Inspected", value: safeArray(inspected), inline: true },
                { name: "Prompts", value: prompts, inline: true },
            ]);
    }

    return new Discord.MessageEmbed()
        .setTitle("Information")
        .setDescription(
            "You have inspected all the players you could inspect. Only thing left to do is to kill everyone else.",
        )
        .setThumbnail(sorceressThumbnail)
        .setColor(Color.WerewolfRed)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields([{ name: "Previously Inspected", value: safeArray(inspected), inline: true }]);
}

/* Werewolf */
export function RoleWerewolf(role: Roles.Werewolf) {
    const werewolves = role.game.players.all
        .filter((player) => player.role instanceof Roles.Werewolf)
        .map((werewolf) => werewolf.toTextString());

    return new Discord.MessageEmbed()
        .setTitle("You are a Werewolf")
        .setDescription(
            dedent(`
      You are a werewolf and learn the identity of all other werewolves, if any. 
      
      Every night, eliminate a player and avoid suspicion.
    `),
        )
        .setThumbnail(werewolfThumbnail)
        .setColor(Color.WerewolfRed)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addField("Werewolves", safeArray(werewolves))
        .addFields(generateObjectiveFields(role))
        .addField(
            "During the Night Phase",
            dedent(`
        During the night, you will receive a prompt via DM to select a player to eliminate. You can change your selection at any point during the night, but you must confirm a selection or you will forfeit your action.
            
        When the night phase ends, the player with the most werewolves targeting them will be eliminated. If there is not a single player with the most werewolves targeting them, no player will be eliminated.
        
        It is recommended you coordinate with your fellow Werewolves via private message to ensure your success.
      `),
        );
}
export function ActionWerewolf(role: Roles.Werewolf) {
    const prompts = ["⬆️ `Previous Player`", "⬇️ `Next Player`", "✅ `Target Selected Player`"];
    const werewolves = role.game.players.all.filter((player) => player.role instanceof Roles.Werewolf);

    const targets = werewolves.map((werewolf) => {
        const r = werewolf.role as Roles.Werewolf;

        if (r.target) {
            return `${werewolf.toTextString()} is targeting ${r.target.toTextString()}.`;
        }

        return `${werewolf.toTextString()} has not targeted anybody.`;
    });

    // Get a list of all players we have already inspected.
    const available = role.availableToTarget.map((player, index) => {
        const selection = index === role.targetIndex ? "🟦" : "⬜";

        return `${selection} ${player.toTextString()}`;
    });

    return new Discord.MessageEmbed()
        .setTitle("Time To Feast")
        .setDescription("")
        .setThumbnail(werewolfThumbnail)
        .setColor(Color.WerewolfRed)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields([
            { name: "Currently Targeting", value: safeArray(targets) },
            { name: "Available Targets", value: safeArray(available), inline: true },
            { name: "Prompts", value: prompts, inline: true },
        ]);
}

/* Mason */
export function RoleMason(role: Roles.Mason) {
    const masons = role.game.players.all
        .filter((player) => player.role instanceof Roles.Mason)
        .map((werewolf) => werewolf.toTextString());

    return new Discord.MessageEmbed()
        .setTitle("You are a Mason")
        .setDescription(
            dedent(`
      You are a mason and learn the identity of all other Masons. These are the only people you can truly trust.
    `),
        )
        .setThumbnail(masonThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addField("Masons", safeArray(masons))
        .addFields(generateObjectiveFields(role));
}

/* Mayor */
export function RoleMayor(role: Roles.Mayor) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Mayor")
        .setDescription(
            dedent(`
      As mayor of this village, your votes to accuse and lynch players will be counted twice. That's democracy at work after all.
    `),
        )
        .setThumbnail(mayorThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role));
}

/* Lycan */
export function RoleLycan(role: Roles.Lycan) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Lycan")
        .setDescription(
            dedent(`
      You are a villager that has been cursed with mild lycanthropy and will appear to the seer as a werewolf, even though you are a villager.
    `),
        )
        .setThumbnail(lycanThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role));
}

/* Prince */
export function RolePrince(role: Roles.Prince) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Prince")
        .setDescription(
            dedent(`
      You are a villager and royal linage of the nearby kingdom. If you are about to be lynched, your role is revealed and you stay in the game.
    `),
        )
        .setThumbnail(princeThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role));
}

/* Tanner */
export function RoleTanner(role: Roles.Tanner) {
    return new Discord.MessageEmbed()
        .setTitle("You are the Tanner")
        .setDescription(
            dedent(`
      You hate your job and your life. Find a way to be eliminated to win.
    `),
        )
        .setThumbnail(tannerThumbnail)
        .setColor(Color.TannerBrown)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role));
}

/* Bodyguard */
export function RoleBodyguard(role: Roles.Bodyguard) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Bodyguard")
        .setDescription(
            dedent(`
      You are a bodyguard and can protect a player from the werewolves at night.
    `),
        )
        .setThumbnail(bodyguardThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role))
        .addField(
            "During the Night Phase",
            dedent(`
        During the night, you will receive a prompt via DM to select a player to protect. You can change your selection at any point during the night, but you must confirm a selection or you will forfeit your action.
            
        The player you select will be protected from elimination by the werewolves. You can even target yourself if you so choose.
      `),
        );
}
export function ActionBodyguard(role: Roles.Bodyguard) {
    const target = role.target ? role.target.toTextString() : "*You are not protecting any player.*";
    const prompts = ["⬆️ `Previous Player`", "⬇️ `Next Player`", "✅ `Target Selected Player`"];

    const available = role.availableToProtect.map((player, index) => {
        const selection = index === role.protectIndex ? "🟦" : "⬜";

        return `${selection} ${player.toTextString()}`;
    });

    return new Discord.MessageEmbed()
        .setTitle("Raise Your Shield")
        .setDescription(
            dedent(`
      Choose a player to protect. If they are picked by the werewolves for elimination, they will not be eliminated. You can protect yourself.
    `),
        )
        .setThumbnail(bodyguardThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields([
            { name: "Currently Protecting", value: target },
            { name: "Available To Protect", value: safeArray(available), inline: true },
            { name: "Prompts", value: prompts, inline: true },
        ]);
}

/* Hunter */
export function RoleHunter(role: Roles.Hunter) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Hunter")
        .setDescription(
            dedent(`
      You are a hunter and can target a player to eliminate if you are eliminated. You can change your choice at any time and will be notified if your target is eliminated before you.
    `),
        )
        .setThumbnail(hunterThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role));
}
export function ActionHunter(role: Roles.Hunter) {
    const target = role.target ? role.target.toTextString() : "*You are not targeting any player.*";
    const prompts = ["⬆️ `Previous Player`", "⬇️ `Next Player`", "✅ `Target Selected Player`"];

    const available = role.availableToTarget.map((player, index) => {
        const selection = index === role.targetIndex ? "🟦" : "⬜";

        return `${selection} ${player.toTextString()}`;
    });

    return new Discord.MessageEmbed()
        .setTitle("Available Targets")
        .setDescription(
            dedent(`
      Choose a player to target. If you are eliminated, they will be eliminated as well. You can update your target at any point before your death.
    `),
        )
        .setThumbnail(hunterThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields([
            { name: "Currently Protecting", value: target },
            { name: "Available To Protect", value: safeArray(available), inline: true },
            { name: "Prompts", value: prompts, inline: true },
        ]);
}

/* Witch */
export function RoleWitch(role: Roles.Witch) {
    return new Discord.MessageEmbed()
        .setTitle("You are a Witch")
        .setDescription(
            dedent(`
      You are a witch and can at night, once per game kill a player or save a player from werewolves. You can only use each power once per game, and then you are treated as a Villager.
    `),
        )
        .setThumbnail(witchThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields(generateObjectiveFields(role))
        .addField(
            "During the Night Phase",
            dedent(`
        During the night, you will receive a prompt with possible actions you can take. You DO NOT need to take an action right away and can wait for the perfect opportunity to arrive.
            
        If you choose to kill a player, that player will be eliminated in the morning if they were not already targeted by the werewolves.
        If you choose to save a player, any player that was targeted by werewolves will not die.
      `),
        );
}
export function ActionWitch(role: Roles.Witch) {
    const target = role.target ? role.target : "*You are not targeting to kill any player.*";
    const save = role.doSave ? "You will save whoever is targeted by the werewolves." : "You will remain passive.";
    const prompts = [];

    if (!role.usedKillPotion) {
        prompts.push("⬆️ `Previous Player`");
        prompts.push("⬇️ `Next Player`");
        prompts.push("☠️`Toggle Kill Selected Player`");
    }

    if (!role.usedSavePotion) {
        prompts.push("⚕️`Toggle Save Werewolves' Target`");
    }

    // Get a list of all players we have already inspected.
    const available = role.availableToTarget.map((player, index) => {
        const selection = index === role.targetIndex ? "🟦" : "⬜";

        return `${selection} ${player.toTextString()}`;
    });

    const embed = new Discord.MessageEmbed()
        .setTitle("The Power Of The Potions")
        .setDescription(
            dedent(`
      If you have not used your potions of Save or Kill yet, you can choose to use them tonight or you can save them for another night.
    `),
        )
        .setThumbnail(witchThumbnail)
        .setColor(Color.VillagerBlue)
        .setAuthor(role.game)
        .setFooter(Tip())
        .addFields([
            {
                name: "Potions To Use",
                value: dedent(`
          ${!role.usedKillPotion ? target : "You have used your kill potion."}
          ${!role.usedSavePotion ? save : "You have used your save potion."}
        `),
            },
        ]);

    if (!role.usedKillPotion) {
        embed.addField("Available To Kill", safeArray(available), true);
    }

    return embed.addField("Prompts", safeArray(prompts), true);
}
