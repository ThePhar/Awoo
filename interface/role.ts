import * as D     from 'discord.js'
import Appearance from '../enum/appearance'
import Player     from '../struct/player'
import Prompt     from '../struct/prompt'
import Team       from '../enum/team'

export default abstract class Role {
  public readonly player:  Player
  public          prompt?: Prompt

  public abstract name:       string
  public abstract pluralName: string
  public abstract appearance: Appearance
  public abstract team:       Team

  public constructor(player: Player) {
    this.player = player
  }

  public async startRole(): Promise<void> {
    await this.player.send(this.roleDescriptionEmbed())
  }
  public async startAction(): Promise<void> { /* Do Nothing By Default */ }
  public resetActionState(): void { /* Do Nothing By Default */ }

  protected roleDescriptionEmbed(): D.MessageEmbed {
    throw new Error('Role description not implemented.')
  }
  protected actionEmbed(): D.MessageEmbed {
    throw new Error('Action description not implemented.')
  }

  get game() {
    return this.player.game
  }
}
