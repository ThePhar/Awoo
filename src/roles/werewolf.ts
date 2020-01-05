import Role from "../interfaces/role";
import { RichEmbed } from "discord.js";
import rs from "../strings/role-strings";
import Colors from "../structs/colors";
import s from "../strings";

export default class Werewolf implements Role {
    name = "Werewolf";
    appearance = "werewolf";

    embed(): RichEmbed {
        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(rs.werewolf.description)
            .setColor(Colors.WerewolfRed)
            .setThumbnail(rs.werewolf.imageUrl)
            .addField(s.fieldNames.teamAndWinConditions, rs.werewolf.winCondition)
            .addField(s.fieldNames.dayCommands, s.villager.day, true)
            .addField(s.fieldNames.nightCommands, s.werewolf.night, true)
            .addField(s.fieldNames.werewolves, "Not implemented yet.") // TODO: Implement werewolves selector.
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date."); // TODO: Change help placeholder
    }
}
