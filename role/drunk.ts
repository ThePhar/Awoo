import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Drunk extends Role {
  public static readonly roleName = "Villager"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Unknown
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/429907716165730308/668771396264001537/drunk.png"
  public static readonly description = dedent(`
    __**Drunk Description**__
    The Drunk thinks he is a regular villager for the first two days, and does not know what he really is until the third night, when he sobers up and learns his real role. The Seer sees the Drunk by his actual role (even if he doesn't know it yet).
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Drunk.team }
  public get name(): string { return this._name || Drunk.roleName }
  public get appearance(): Appearance { return this._appearance || Drunk.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Drunk")
    .setThumbnail(Drunk.thumbnail)
    .setDescription(Drunk.description)
    .setColor(Color.Default)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
