import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Tanner extends Role {
  public name = "Tanner"
  public appearance = Appearance.Villager
  public team = Team.Tanner
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are The Tanner")
    .setThumbnail(Template.Role.tannerThumbnail)
    .setColor(Color.TannerBrown)
    .addField("Objective", Template.Objective.tannerObjective(), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .setDescription(
      "The Tanner only wins if he is eliminated. Victory conditions for the other teams are still present; the game " +
      "continues after the Tanner wins."
    )
}
