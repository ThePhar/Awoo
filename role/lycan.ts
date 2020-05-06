import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Lycan extends Role {
  public name = "Lycan"
  public appearance = Appearance.Werewolf
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Lycan")
    .setThumbnail(Template.Role.lycanThumbnail)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .setDescription(
      "The Lycan has a dormant strain of lycanthropy, and appears to be a Werewolf to the Seer even though she's " +
      "not. In games where roles are revealed on death, the Lycan is shown to the players to be a Werewolf when she " +
      "is eliminated."
    )
}
