import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Role from "../interface/role";
import Team from "../enum/team";

export class Villager extends Role {
    public name = "Villager";
    public pluralName = "Villagers";
    public appearance = Appearance.Villager;
    public team = Team.Villagers;

    protected roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleVillager(this);
    }
}
