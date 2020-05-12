import dedent        from "dedent"
import * as Discord  from "discord.js"
import * as Template from "../template"
import Appearance    from "../enum/appearance"
import Color         from "../enum/color"
import Role          from "../struct/role"
import Team          from "../enum/team"

export class Seer extends Role {
  public readonly name = "Seer"

  public static readonly appearance  = Appearance.Villager
  public static readonly team        = Team.Villagers
  public static readonly description = dedent(`
    __**Seer Description**__
    Each night, the Seer chooses a player and learns if they are a Werewolf or Villager.
  `)
  public static readonly thumbnail   =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427035228307493/seer.png"

  public roleEmbed = (): Discord.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Seer")
    .setThumbnail(Seer.thumbnail)
    .setDescription(Seer.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.seerRules())

  public get appearance(): Appearance { return this._appearance || Seer.appearance }
  public get team():       Team       { return this._team       || Seer.team }
}
