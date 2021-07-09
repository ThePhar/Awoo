import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Team from "../enum/team";
import { Villager } from "./villager";

export class Mayor extends Villager {
    public override name = "Mayor";
    public override pluralName = "Mayors";
    public override appearance = Appearance.Villager;
    public override team = Team.Villagers;

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleMayor(this);
    }
}
