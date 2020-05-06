import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Mason extends Role {
  public name = "Mason"
  public appearance = Appearance.Villager
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Mason")
    .setThumbnail(Template.Role.masonThumbnail)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .setDescription(
      "The Masons learn the identity of the other Masons the first night. If a Mason is alive, no one in the village " +
      "may directly speak of the Masons, or the players who speak of them are eliminated that night by the secret " +
      "society in order to keep it a secret. If they are eliminated by the secret society, they automatically lose, " +
      "even if they are on a winning team."
    )
}
