import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Minion extends Role {
  public static readonly roleName = "Minion"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Werewolves
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/429907716165730308/668771402236559360/minion.png"
  public static readonly description = dedent(`
    __**Minion Description**__
    On the first night, the Minion learns the identity of the Werewolves, but does not choose a target with the werewolves on subsequent nights. They are on the werewolf team, but appear as a Villager to the Seer.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Minion.team }
  public get name(): string { return this._name || Minion.roleName }
  public get appearance(): Appearance { return this._appearance || Minion.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Minion")
    .setThumbnail(Minion.thumbnail)
    .setDescription(Minion.description)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
