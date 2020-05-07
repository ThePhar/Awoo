import dedent from "dedent"
import * as D from "discord.js"
import * as Template from "../template"
import Appearance from "../enum/appearance"
import Color from "../enum/color"
import Role from "../struct/role"
import Team from "../enum/team"
import TeamsInPlay from "../enum/teams-in-play"

export class Doppelganger extends Role {
  public static readonly roleName = "Doppelgänger"
  public static readonly appearance = Appearance.Villager
  public static readonly team = Team.Villagers
  public static readonly thumbnail =
    "https://media.discordapp.net/attachments/429907716165730308/668771394254798878/doppelganger.png"
  public static readonly description = dedent(`
    __**Doppelgänger Description**__
    The Doppelgänger chooses a player the first night. If that player is eliminated, the Doppelgänger secretly takes over that role. Until their target is eliminated, the Doppelgänger is on the Village Team. They will be notified of their new role and team when their target is eliminated immediately. The Doppelgänger appears as a Villager to the Seer until their target is eliminated, then is shown as their new role after that time. If the Doppelgänger becomes a Werewolf, they join the werewolf team.  
  `)

  /* Accessors for getting role information */
  public get team(): Team { return this._team || Doppelganger.team }
  public get name(): string { return this._name || Doppelganger.roleName }
  public get appearance(): Appearance { return this._appearance || Doppelganger.appearance }

  public roleEmbed = (): D.MessageEmbed => Template.default(this.game)
    .setTitle("You Are A Doppelgänger")
    .setThumbnail(Doppelganger.thumbnail)
    .setDescription(Doppelganger.description)
    .setColor(Color.VillagerBlue)
    .addField("Objective", Template.Objective.villagerObjective(TeamsInPlay.WerewolvesOnly), true)
    .addField("Team", this.team, true)
    .addField("During The Day", Template.Actions.lynchingRules(this.game))

  public actionEmbed = undefined
}
