import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Werewolf extends Role {
  public name = "Werewolf"
  public appearance = Appearance.Werewolf
  public team = Team.Werewolves
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Werewolf")
    .setThumbnail(Template.Role.werewolfThumbnail)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.werewolfRules())
    .setDescription(
      "The Werewolves learn the identity of the other Werewolves the first night. Every night after the first night, " +
      "the majority of the Werewolves must agree on a target to eliminate. If the majority of the Werewolves fail to " +
      "vote for a single target, no player will be eliminated that night. The werewolves may not target another " +
      "Werewolf at night. Werewolves try and keep their identity a secret during the day."
    )
}
