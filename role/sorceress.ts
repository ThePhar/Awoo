import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Sorceress extends Role {
  public name = "Sorceress"
  public appearance = Appearance.Villager
  public team = Team.Werewolves
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Sorceress")
    .setThumbnail(Template.Role.sorceressThumbnail)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.sorceressRules())
    .setDescription(
      "The Sorceress looks for the Seer each night. The Werewolves do not know who the Sorceress is, and the " +
      "Sorceress does not know who the Werewolves are. The Seer sees the Sorceress as a Villager."
    )
}
