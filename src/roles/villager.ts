import Role from "../interfaces/role";
import { RichEmbed } from "discord.js";
import Colors from "../structs/colors";
import rs from "../strings/role-strings";
import s from "../strings";
import Player from "../structs/player";

export default class Villager implements Role {
    name = "Villager";
    appearance = "villager";
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    embed(): RichEmbed {
        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(rs.villager.description)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(rs.villager.imageUrl)
            .addField(s.fieldNames.teamAndWinConditions, rs.villager.winCondition)
            .addField(s.fieldNames.dayCommands, s.villager.day, true)
            .addField(s.fieldNames.nightCommands, s.villager.night, true)
            .setFooter("Tip: This is a placeholder template and is subject to change at a later date.");
    }
}
