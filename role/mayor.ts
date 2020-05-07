import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Mayor extends Role {
  public static readonly roleName = "Mayor"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427033936592924/mayor.png"
  public static readonly description = dedent(`
    __**Mayor Description**__
    The Mayor's vote counts twice when voting to eliminate a player, because that's how democracy works.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team ? this._team : Mayor.team }
  public get name(): string { return this._name ? this._name : Mayor.roleName }
  public get appearance(): Appearance { return this._appearance ? this._appearance : Mayor.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Mayor")
    .setThumbnail(Mayor.thumbnail)
    .setDescription(Mayor.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
