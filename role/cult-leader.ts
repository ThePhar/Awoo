import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class CultLeader extends Role {
  public static readonly roleName = "Cult Leader"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Cult
  public static readonly thumbnail = ""
  public static readonly description = dedent(`
    __**Cult Leader Description**__
    The Cult Leader picks a player each night to add to the cult (players picked do not know they are in the cult). The Cult Leader only wins if all players left in the game (not necessarily including himself) are part of the cult. Normal victory conditions for the other teams are still present.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || CultLeader.team }
  public get name(): string { return this._name || CultLeader.roleName }
  public get appearance(): Appearance { return this._appearance || CultLeader.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are The Cult Leader")
    .setThumbnail(CultLeader.thumbnail)
    .setDescription(CultLeader.description)
    .setColor(Color.CultGreen)
    .addField("Objective", Template.Objective.cultLeaderObjective(), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.cultLeaderRules())

  public actionEmbed = undefined
}
