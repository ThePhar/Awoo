import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Witch extends Role {
  public static readonly roleName = "Witch"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/663423717753225227/666427027389415444/witch.png"
  public static readonly description = dedent(`
    __**Witch Description**__
    The witch may use her power to prevent anyone being eliminated at night once during the game. She may also use her other power to eliminate a player of her choice at night once during the game. Both powers may be used in the same night.
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Witch.team }
  public get name(): string { return this._name || Witch.roleName }
  public get appearance(): Appearance { return this._appearance || Witch.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Witch")
    .setThumbnail(Witch.thumbnail)
    .setDescription(Witch.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("During The Night", Template.Actions.witchRules())

  public actionEmbed = undefined
}
