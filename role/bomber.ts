import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Bomber extends Role {
  public static readonly roleName = "Mad Bomber"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail = "" // TODO: Create thumbnail.
  public static readonly description = dedent(`
    __**Mad Bomber Description**__
    If the Mad Bomber is eliminated, 2 random living players will be eliminated instantly. The order in which players are eliminated is random.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Bomber.team }
  public get name(): string { return this._name || Bomber.roleName }
  public get appearance(): Appearance { return this._appearance || Bomber.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Mad Bomber")
    .setThumbnail(Bomber.thumbnail)
    .setDescription(Bomber.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
