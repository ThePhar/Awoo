import * as D from "discord.js"
import Role from "../struct/role"
import Appearance from "../enum/appearance"
import Team from "../enum/team"
import fullAnnouncementEmbed from "../template"

export class Villager extends Role {
  public name = "Villager"
  public appearance = Appearance.Villager
  public team = Team.Villagers
  public actionEmbed = undefined

  public roleEmbed = (): D.MessageEmbed => fullAnnouncementEmbed(this.game)
    .setTitle("You Are A Villager")
    .setDescription("")
}
