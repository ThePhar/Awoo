import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Tanner extends Role {
  public static readonly roleName = "Tanner"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Tanner
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427021949141035/tanner.png"
  public static readonly description = dedent(`
    __**Tanner Description**__
    The Tanner only wins if he is eliminated. Victory conditions for the other teams are still present; the game continues after the Tanner wins.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Tanner.team }
  public get name(): string { return this._name || Tanner.roleName }
  public get appearance(): Appearance { return this._appearance || Tanner.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are The Tanner")
    .setThumbnail(Tanner.thumbnail)
    .setDescription(Tanner.description)
    .setColor(Color.TannerBrown)
    .addField("Objective", Template.Objective.tannerObjective(), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
