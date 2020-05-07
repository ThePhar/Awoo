import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Lycan extends Role {
  public static readonly roleName = "Lycan"
  public static readonly appearance = Appearance.Werewolf
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427032007344149/lycan.png"
  public static readonly description = dedent(`
    __**Lycan Description**__
    The Lycan has a dormant strain of lycanthropy, and appears to be a Werewolf to the Seer even though she's not. In games where roles are revealed on death, the Lycan is shown to the players to be a Werewolf when she is eliminated.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team ? this._team : Lycan.team }
  public get name(): string { return this._name ? this._name : Lycan.roleName }
  public get appearance(): Appearance { return this._appearance ? this._appearance : Lycan.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Lycan")
    .setThumbnail(Lycan.thumbnail)
    .setDescription(Lycan.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
