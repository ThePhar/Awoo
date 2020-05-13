import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Villager extends Role {
    public readonly name = "Villager"

    public static readonly appearance = Appearance.Villager
    public static readonly team = Team.Villagers
    public static readonly thumbnail =
        "https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png"
    public static readonly description = dedent(`
        __**Villager Description**__
        Villagers' sole purpose is to find the Werewolves and eliminate them.
    `)

    public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
        .setTitle("You Are A Villager")
        .setThumbnail(Villager.thumbnail)
        .setDescription(Villager.description)
        .setColor(Color.VillagerBlue)
        .addField("Objective", Template.Objective.villagerObjective(), true)
        .addField("Team", this.team, true)
        .addField("During The Day", Template.Actions.lynchingRules(this.game))

    public get appearance(): Appearance { return this._appearance || Villager.appearance }
    public get team(): Team { return this._team || Villager.team }
}
