import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Bodyguard extends Role {
  public name = "Bodyguard"
  public appearance = Appearance.Villager
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Bodyguard")
    .setThumbnail(Template.Role.bodyguardThumbnail)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.bodyguardRules())
    .setDescription(
      "The Bodyguard chooses a different player each night to protect (but not the same player twice in a row). That " +
      "player cannot be eliminated that night. He may also choose himself."
    )
}
