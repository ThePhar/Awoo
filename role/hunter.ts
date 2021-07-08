import * as D       from 'discord.js'
import * as Embed   from '../template/role'
import Appearance   from '../enum/appearance'
import Player       from '../struct/player'
import Prompt       from '../struct/prompt'
import Team         from '../enum/team'
import { Villager } from './villager'

export class Hunter extends Villager {
  public name       = 'Hunter'
  public pluralName = 'Hunters'
  public appearance = Appearance.Villager
  public team       = Team.Villagers

  /* Hunter Specific Fields */
  public availableToTarget: Player[] = []
  public targetIndex = 0
  public target?: Player
  public fired = false

  public async startAction(): Promise<void> {
    // Get all players we can inspect.
    this.availableToTarget = this.game.players.alive.filter((player) => player.id !== this.player.id)
    this.targetIndex = 0

    if (this.target && !this.target.alive && this.player.alive) {
      await this.player.send(`${this.target.toTextString()} was eliminated, you will need to update your target.`)
      this.target = undefined
    }

    // Update prompt.
    if (!this.prompt) {
      const message = await this.player.send(this.actionEmbed())
      await message.react('⬆️')
      await message.react('⬇️')
      await message.react('✅')

      this.prompt = new Prompt(message, this, this.reactionHandler.bind(this))
    } else {
      await this.prompt.message.edit(this.actionEmbed())
    }
  }

  protected roleDescriptionEmbed(): D.MessageEmbed {
    return Embed.RoleHunter(this)
  }
  protected actionEmbed(): D.MessageEmbed {
    return Embed.ActionHunter(this)
  }

  private async reactionHandler(react: D.MessageReaction, _: D.User): Promise<void> {
    if (this.fired) {
      if (this.prompt) {
        this.prompt.destroy()
      }
      return
    }

    const emoji = react.emoji.name
    const max = this.availableToTarget.length - 1

    // If our prompt suddenly disappeared, do not proceed.
    if (!this.prompt) return

    // No point in asking for input if there's no one to inspect.
    if (max < 0) {
      this.prompt.destroy()
    }

    switch (emoji) {
      // Previous selection.
      case '⬆️':
        this.targetIndex -= 1
        if (this.targetIndex < 0) {
          this.targetIndex = max
        }
        break

      // Next selection.
      case '⬇️':
        this.targetIndex += 1
        if (this.targetIndex > max) {
          this.targetIndex = 0
        }
        break

      // Confirm selection.
      case '✅':
        this.target = this.availableToTarget[this.targetIndex]
        break

      // Invalid reaction.
      default:
        return
    }

    // Update the prompt message.
    await this.prompt.message.edit(this.actionEmbed())
  }
}
