import dedent from "dedent"
import * as D from "discord.js"
import * as Roles from "./index"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class AlphaWolf extends Role {
  public static readonly roleName = "Alpha Werewolf"
  public static readonly appearance = Appearance.Werewolf
  public static readonly team = Team.Werewolves
  public static readonly thumbnail = "" // TODO: Create thumbnail
  public static readonly description = dedent(`
    __**Alpha Werewolf Description**__
    If the Werewolves are so unfortunate as to lose one of their own, the Alpha Werewolf can choose a player to join their team instead of eliminating them. He gets to use this special power once per game, at his discretion. The player converted will no longer be their old role and cannot utilize their previous role's powers.
    
    ${Roles.Werewolf.description}
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || AlphaWolf.team }
  public get name(): string { return this._name || AlphaWolf.roleName }
  public get appearance(): Appearance { return this._appearance || AlphaWolf.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are The Alpha Werewolf")
    .setThumbnail(AlphaWolf.thumbnail)
    .setDescription(AlphaWolf.description)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.werewolfRules())
    .addField("After The First Werewolf Is Eliminated", Template.Actions.alphaWolfRules())

  public actionEmbed = undefined
}
