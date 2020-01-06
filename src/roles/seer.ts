import Role from "../interfaces/role";
import { RichEmbed } from "discord.js";
import rs from "../strings/role-strings";
import Colors from "../structs/colors";
import s from "../strings";

export default class Seer implements Role {
    name = "Seer";
    appearance = "villager";

    embed(): RichEmbed {
        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(rs.seer.description)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(rs.seer.imageUrl)
            .addField(s.fieldNames.teamAndWinConditions, rs.villager.winCondition)
            .addField(s.fieldNames.dayCommands, s.villager.day, true)
            .addField(s.fieldNames.nightCommands, s.seer.night, true)
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date."); // TODO: Replace with help text
    }
}
