import dedent from "dedent"
import * as D from "discord.js"
import * as Roles from "./index"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class ApprenticeSeer extends Role {
  public static readonly roleName = "Apprentice Seer"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/429907716165730308/668771392363429898/apprentice_seer.png"
  public static readonly description = dedent(`
    __**Apprentice Seer Description**__
    The Apprentice Seer becomes the Seer if the Seer is eliminated.    
    
    ${Roles.Seer.description}
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || ApprenticeSeer.team }
  public get name(): string { return this._name || ApprenticeSeer.roleName }
  public get appearance(): Appearance { return this._appearance || ApprenticeSeer.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are An Apprentice Seer")
    .setThumbnail(ApprenticeSeer.thumbnail)
    .setDescription(ApprenticeSeer.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))
    .addField("Each Night After The Seer Is Eliminated", Template.Actions.apprenticeSeerRules())

  public actionEmbed = undefined
}
