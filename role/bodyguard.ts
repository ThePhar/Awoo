import * as D       from 'discord.js'
import * as Embed   from '../template/role'
import Appearance   from '../enum/appearance'
import Player       from '../struct/player'
import Prompt       from '../struct/prompt'
import Team         from '../enum/team'
import { Villager } from './villager'

export class Bodyguard extends Villager {
  public name       = 'Bodyguard'
  public pluralName = 'Bodyguards'
  public appearance = Appearance.Villager
  public team       = Team.Villagers

  /* Bodyguard Specific Fields */
  public availableToProtect: Player[] = []
  public protectIndex = 0
  public target?: Player

  public async startAction(): Promise<void> {
    this.resetActionState()

    // Ignore this on the first night.
    if (this.game.day === 1) {
      return
    }

    // Get all players we can inspect.
    this.availableToProtect = this.game.players.alive

    // Send the action prompt and start listening for reaction events.
    const message = await this.player.send(this.actionEmbed())
    await message.react('⬆️')
    await message.react('⬇️')
    await message.react('✅')

    // Create prompt for this message.
    this.prompt = new Prompt(message, this, this.reactionHandler.bind(this))
  }

  public resetActionState(): void {
    this.availableToProtect = []
    this.protectIndex = 0
    this.target = undefined

    if (this.prompt) {
      this.prompt.destroy()
    }
  }

  protected roleDescriptionEmbed(): D.MessageEmbed {
    return Embed.RoleBodyguard(this)
  }
  protected actionEmbed(): D.MessageEmbed {
    return Embed.ActionBodyguard(this)
  }

  private async reactionHandler(react: D.MessageReaction, _: D.User): Promise<void> {
    const emoji = react.emoji.name
    const max = this.availableToProtect.length - 1

    // If our prompt suddenly disappeared, do not proceed.
    if (!this.prompt) return

    // No point in asking for input if there's no one to inspect.
    if (max < 0) {
      this.prompt.destroy()
    }

    switch (emoji) {
      // Previous selection.
      case '⬆️':
        this.protectIndex -= 1
        if (this.protectIndex < 0) {
          this.protectIndex = max
        }
        break

      // Next selection.
      case '⬇️':
        this.protectIndex += 1
        if (this.protectIndex > max) {
          this.protectIndex = 0
        }
        break

      // Confirm selection.
      case '✅':
        this.target = this.availableToProtect[this.protectIndex]
        break

      // Invalid reaction.
      default:
        return
    }

    // Update the prompt message.
    await this.prompt.message.edit(this.actionEmbed())
  }
}
