import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Bodyguard extends Role {
  public static readonly roleName = "Bodyguard"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427028823605258/bodyguard.png"
  public static readonly description = dedent(`
    __**Bodyguard Description**__
    The Bodyguard chooses a different player each night to protect (but not the same player twice in a row). That player cannot be eliminated that night. He may also choose himself.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Bodyguard.team }
  public get name(): string { return this._name || Bodyguard.roleName }
  public get appearance(): Appearance { return this._appearance || Bodyguard.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Bodyguard")
    .setThumbnail(Bodyguard.thumbnail)
    .setDescription(Bodyguard.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.bodyguardRules())

  public actionEmbed = undefined
}
