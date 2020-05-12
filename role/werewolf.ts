import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"

export class Werewolf extends Role {
  public static readonly roleName = "Werewolf"
  public static readonly appearance = Appearance.Werewolf
  public static readonly team = Team.Werewolves
  public static readonly thumbnail =
    "https://cdn.discordapp.com/attachments/663423717753225227/666427025887854596/werewolf_t.png"
  public static readonly description = dedent(`
    __**Werewolf Description**__
    The Werewolves learn the identity of the other Werewolves the first night. Every night after the first night, the majority of the Werewolves must agree on a target to eliminate. If the majority of the Werewolves fail to vote for a single target, no player will be eliminated that night. The werewolves may not target another Werewolf at night. Werewolves try and keep their identity a secret during the day.
  `)

  public isWerewolf = true

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Werewolf.team }
  public get name(): string { return this._name || Werewolf.roleName }
  public get appearance(): Appearance { return this._appearance || Werewolf.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Werewolf")
    .setThumbnail(Werewolf.thumbnail)
    .setDescription(Werewolf.description)
    .setColor(Color.WerewolfRed)
    .addField("Objective", Template.Objective.werewolfObjective(false), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.werewolfRules())

  public actionEmbed = undefined
}
