import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Villager extends Role {
  public static readonly roleName = "Villager"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png"
  public static readonly description = dedent(`
    __**Villager Description**__
    Villagers' sole purpose is to find the Werewolves and eliminate them.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team ? this._team : Villager.team }
  public get name(): string { return this._name ? this._name : Villager.roleName }
  public get appearance(): Appearance { return this._appearance ? this._appearance : Villager.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Villager")
    .setThumbnail(Villager.thumbnail)
    .setDescription(Villager.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
