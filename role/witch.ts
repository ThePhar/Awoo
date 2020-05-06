import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Witch extends Role {
  public name = "Witch"
  public appearance = Appearance.Villager
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Witch")
    .setThumbnail(Template.Role.witchThumbnail)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.witchRules())
    .setDescription(
      "The witch may use her power to prevent someone from being eliminated by the werewolves once during the game. " +
      "She may also use her other power to eliminate a player once during the game to eliminate the player of her " +
      "choice. Both powers may be used in the same night."
    )
}
