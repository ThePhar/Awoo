import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Mason extends Role {
  public static readonly roleName = "Mason"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/429907716165730308/668771401028861962/mason.png"
  public static readonly description = dedent(`
    __**Mason Description**__
    The Masons learn the identity of the other Masons the first night. If a Mason is alive, no one in the village may directly speak of the Masons, or the players who speak of them are eliminated that night by the secret society in order to keep it a secret. If they are eliminated by the secret society, they automatically lose, even if they are on a winning team.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team ? this._team : Mason.team }
  public get name(): string { return this._name ? this._name : Mason.roleName }
  public get appearance(): Appearance { return this._appearance ? this._appearance : Mason.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Mason")
    .setThumbnail(Mason.thumbnail)
    .setDescription(Mason.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
