import randomItem from "random-item";
import { RichEmbed } from "discord.js";
import Role from "../interfaces/role";
import Colors from "../structs/colors";
import Player from "../structs/player";
import FieldStrings from "../strings/fields";
import RoleStrings from "../strings/roles";
import Tips from "../strings/tips";

export default class Villager implements Role {
    name = RoleStrings.villager.name;
    appearance = RoleStrings.villager.appearance;
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    embed(): RichEmbed {
        return new RichEmbed()
            .setTitle(`You are a ${this.name}`)
            .setDescription(RoleStrings.villager.description)
            .setColor(Colors.VillagerBlue)
            .setThumbnail(RoleStrings.villager.thumbnailUrl)
            .addField(FieldStrings.title.winCondition, RoleStrings.villager.winCondition)
            .addField(FieldStrings.title.dayCommands, RoleStrings.villager.dayCommands, true)
            .addField(FieldStrings.title.nightCommands, RoleStrings.villager.nightCommands, true)
            .setFooter(randomItem(Tips));
    }
}
