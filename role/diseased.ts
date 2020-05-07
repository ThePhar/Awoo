import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Diseased extends Role {
  public static readonly roleName = "Diseased"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail = ""
  public static readonly description = dedent(`
    __**Diseased Description**__
    If the Werewolves target and eliminate the Diseased player, they skip targeting the following night because they get sick. If the game is not revealing exact roles on elimination, the Werewolves still pick a target the following night, but that target is not eliminated.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Diseased.team }
  public get name(): string { return this._name || Diseased.roleName }
  public get appearance(): Appearance { return this._appearance || Diseased.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are Diseased")
    .setThumbnail(Diseased.thumbnail)
    .setDescription(Diseased.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
