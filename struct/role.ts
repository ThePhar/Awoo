import * as D from "discord.js"
import Appearance from "../enum/appearance"
import Player from "../struct/player"
import Prompt from "../struct/prompt"
import Team from "../enum/team"
import Game from "./game"

export default abstract class Role {
  public readonly player:  Player
  public prompt?: Prompt
  public abstract name: string
  public abstract appearance: Appearance
  public abstract team: Team

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  public constructor(player: Player) {
    this.player = player
  }

  /**
   * Send the role embed message associated with this role to the player.
   */
  public startRole = async(): Promise<void> => { await this.player.member.send(this.roleEmbed()) }

  // These need to be overwritten by actionable roles.
  public startAction = async(): Promise<void> => { /**/ }
  public resetActionState = (): void => { /**/ }

  public abstract roleEmbed: () => D.MessageEmbed
  public abstract actionEmbed: (() => D.MessageEmbed) | undefined

  public get game(): Game { return this.player.game }
}
