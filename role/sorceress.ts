import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Sorceress extends Role {
  public static readonly roleName = "Sorceress"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Werewolves
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/663423717753225227/666427037384441856/sorceress.png"
  public static readonly description = dedent(`
    __**Sorceress Description**__
    The Sorceress looks for the Seer each night. The Werewolves do not know who the Sorceress is, and the Sorceress does not know who the Werewolves are. The Seer sees the Sorceress as a Villager.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Sorceress.team }
  public get name(): string { return this._name || Sorceress.roleName }
  public get appearance(): Appearance { return this._appearance || Sorceress.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Sorceress")
    .setThumbnail(Sorceress.thumbnail)
    .setDescription(Sorceress.description)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.sorceressRules())

  public actionEmbed = undefined
}
