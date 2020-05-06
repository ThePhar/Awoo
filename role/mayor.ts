import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Mayor extends Role {
  public name = "Mayor"
  public appearance = Appearance.Villager
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Mayor")
    .setThumbnail(Template.Role.mayorThumbnail)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .setDescription(
      "The Mayor's vote counts twice when voting to eliminate a player, because that's how democracy works."
    )
}
