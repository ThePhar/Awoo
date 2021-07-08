import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Team from "../enum/team";
import { Villager } from "./villager";

export class Mason extends Villager {
    public override name = "Mason";
    public override pluralName = "Masons";
    public override appearance = Appearance.Villager;
    public override team = Team.Villagers;

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleMason(this);
    }
}
