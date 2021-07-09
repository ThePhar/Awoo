import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Role from "../interface/role";
import Team from "../enum/team";

export class Tanner extends Role {
    public override name = "Tanner";
    public override pluralName = "Tanners";
    public override appearance = Appearance.Villager;
    public override team = Team.Tanner;

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleTanner(this);
    }
}
