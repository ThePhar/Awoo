import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Team from "../enum/team";
import { Villager } from "./villager";

export class Lycan extends Villager {
    public override name = "Lycan";
    public override pluralName = "Lycans";
    public override appearance = Appearance.Werewolf;
    public override team = Team.Villagers;

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleLycan(this);
    }
}
