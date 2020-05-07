import dedent from "dedent"
import * as D from "discord.js"
import * as Roles from "./index"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class WolfMan extends Role {
  public static readonly roleName = "Wolf Man"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Werewolves
  public static readonly thumbnail = "" // TODO: Write thumbnail.
  public static readonly description = dedent(`
    __**Wolf Man Description**__
    The Wolf Man is a Werewolf, but the Seer sees him as a Villager.
    
    ${Roles.Werewolf.description}
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || WolfMan.team }
  public get name(): string { return this._name || WolfMan.roleName }
  public get appearance(): Appearance { return this._appearance || WolfMan.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Wolf Man")
    .setThumbnail(WolfMan.thumbnail)
    .setDescription(WolfMan.description)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
