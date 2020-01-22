import dedent from "dedent";
import Color  from "../structs/color";

export default {
    day: {
        title: (day: number): string =>
            `Start of Day ${day}`,
        description:
            dedent(`
                > The newborn sun greets all those fortunate enough to survive the night.
                
                 You have until sundown to decide on a villager to lynch. To vote to lynch a player, type \`!lynch <name>\` in this channel to make your vote public or via DM with this bot to make it privately. The player with the most votes to be lynched will be eliminated.
            `),
        color: Color.Information,
        image: "https://cdn.discordapp.com/attachments/668777649211965450/669332922725171231/village.png",
    },
    night: {
        title: (day: number): string =>
            `Start of Night ${day}`,
        description:
            dedent(`
                > As the sun sets, a chill runs down your spine. Will you wake to see the sun again?
                
                 During the night, you will not be allowed to vote to lynch any players, but you can continue discussion in this channel. If you have a role with actions you can take at night, you will receive a notification via DM. 
                 
                 ***Do not send your night action commands in this channel; please send them via DM.***
            `),
        color: Color.Information,
        image: "https://cdn.discordapp.com/attachments/668777649211965450/669336328072331284/night.png",
    }
}
