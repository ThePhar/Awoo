import * as D from "discord.js"
import Appearance from "../enum/appearance"
import Player from "../struct/player"
import Prompt from "../struct/prompt"
import Team from "../enum/team"
import Game from "./game"
import Color from "../enum/color"
import { Villager } from "../role"

export default abstract class Role {
  public static readonly roleName: string
  public static readonly appearance: Appearance
  public static readonly team: Team
  public static readonly thumbnail: string
  public static readonly description: string

  protected _name?: string
  protected _appearance?: Appearance
  protected _team?: Team

  public readonly player: Player
  public prompt?: Prompt

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  public constructor(player: Player) {
    this.player = player
  }

  // These need to be overwritten by actionable roles.
  public startAction = async(): Promise<void> => { /**/ }
  public resetActionState = (): void => { /**/ }

  public abstract roleEmbed: () => D.MessageEmbed
  public abstract actionEmbed: (() => D.MessageEmbed) | undefined

  /**
   * Send the role embed message associated with this role to the player.
   */
  public async startRole(): Promise<void> {
    await this.player.member.send(this.roleEmbed())
  }

  /**
   * Send a description of this role to chat.
   */
  public static async printRoleSummary(game: Game): Promise<D.Message> {
    const appearance = this.appearance
    const uppercaseAppearance = appearance[0].toUpperCase() + appearance.slice(1)

    // Get color of the team we are describing.
    let color: Color
    switch (this.team) {
      case Team.Villagers:
        color = Color.VillagerBlue
        break
      case Team.Werewolves:
        color = Color.WerewolfRed
        break
      case Team.Tanner:
        color = Color.TannerBrown
        break
      case Team.Cult:
        color = Color.CultGreen
        break
      case Team.Vampires:
        color = Color.VampirePurple
        break
      case Team.Unknown:
        color = Color.Default
        break
    }

    return game.announce(
      new D.MessageEmbed()
        .setThumbnail(this.thumbnail)
        .setDescription(this.description)
        .setColor(color)
        .addField("Team", this.team, true)
        .addField("Appears As", uppercaseAppearance, true)
        .addField("Special Role?", this instanceof Villager ? "No" : "Yes", true)
    )
  }

  public get game(): Game { return this.player.game }

  /** Accessors for role information. */
  public abstract get team(): Team
  public abstract get name(): string
  public abstract get appearance(): Appearance
}
