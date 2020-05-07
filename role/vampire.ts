import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Vampire extends Role {
  public static readonly roleName = "Vampire"
  public static readonly appearance = Appearance.Vampire
  public static readonly team = Team.Vampires
  public static readonly thumbnail = "" // TODO: Create thumbnail.
  public static readonly description = dedent(`
    __**Vampire Description**__
    The Vampires are a third major team in addition to the Werewolf team and the Villager team. Vampires choose a target each night (in addition to the Werewolves' target), but that target is not revealed until a player receives a number of accusations equal to the number of living Vampires; the Vampire target is eliminated at that time. Vampires cannot be eliminated by Werewolves, making them slightly more powerful than their furry counterparts. 
    
    In games with both Vampires and Werewolves, Vampires must eliminate all Werewolves and vice versa before they can fulfil their victory conditions. Roles that target Werewolves (e.g. Seer) may also target Vampires, but do not distinguish between the two teams.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Vampire.team }
  public get name(): string { return this._name || Vampire.roleName }
  public get appearance(): Appearance { return this._appearance || Vampire.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Vampire")
    .setThumbnail(Vampire.thumbnail)
    .setDescription(Vampire.description)
    .setColor(Color.VampirePurple)
    .addField("Objective", Template.Objective.vampireObjective(true), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.vampireRules())

  public actionEmbed = undefined
}
