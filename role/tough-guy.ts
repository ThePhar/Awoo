import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class ToughGuy extends Role {
  public static readonly roleName = "Tough Guy"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail = ""
  public static readonly description = dedent(`
    __**Tough Guy Description**__
    If targeted by the Werewolves, the Tough Guy is eliminated the following night (instead of the same night he was targeted). The players are told no one has been eliminated by werewolves on the night he is targeted. The following night there may be two or more player eliminations: The Tough Guy as well as any other characters eliminated that night.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || ToughGuy.team }
  public get name(): string { return this._name || ToughGuy.roleName }
  public get appearance(): Appearance { return this._appearance || ToughGuy.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Tough Guy")
    .setThumbnail(ToughGuy.thumbnail)
    .setDescription(ToughGuy.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
