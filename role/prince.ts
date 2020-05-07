import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Prince extends Role {
  public static readonly roleName = "Prince"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/429907716165730308/705540425573859378/prince.png"
  public static readonly description = dedent(`
    __**Prince Description**__
    If the Prince is voted to be lynched during the day, he is revealed as the Prince, and is not eliminated.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Prince.team }
  public get name(): string { return this._name || Prince.roleName }
  public get appearance(): Appearance { return this._appearance || Prince.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Prince")
    .setThumbnail(Prince.thumbnail)
    .setDescription(Prince.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
