import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Hunter extends Role {
  public static readonly roleName = "Hunter"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/663423717753225227/666427030245736472/hunter.png"
  public static readonly description = dedent(`
    __**Hunter Description**__
    If the Hunter is eliminated (during the day or night), he immediately fires his weapon to the player he targeted, who is then eliminated.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team ? this._team : Hunter.team }
  public get name(): string { return this._name ? this._name : Hunter.roleName }
  public get appearance(): Appearance { return this._appearance ? this._appearance : Hunter.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Hunter")
    .setThumbnail(Hunter.thumbnail)
    .setDescription(Hunter.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("At Any Time", Template.Actions.hunterRules())

  public actionEmbed = undefined
}
