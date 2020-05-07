import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Seer extends Role {
  public static readonly roleName = "Seer"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427035228307493/seer.png"
  public static readonly description = dedent(`
    __**Seer Description**__
    Each night, the Seer chooses a player and learns if they are a Werewolf or Villager.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team ? this._team : Seer.team }
  public get name(): string { return this._name ? this._name : Seer.roleName }
  public get appearance(): Appearance { return this._appearance ? this._appearance : Seer.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Seer")
    .setThumbnail(Seer.thumbnail)
    .setDescription(Seer.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.seerRules())

  public actionEmbed = undefined
}
