import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Prince extends Role {
  public name = "Prince"
  public appearance = Appearance.Villager
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Prince")
    .setThumbnail(Template.Role.princeThumbnail)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .setDescription(
      "If the Prince is voted to be lynched during the day, he is revealed as the Prince, and is not eliminated."
    )
}
