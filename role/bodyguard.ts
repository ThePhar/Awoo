import * as Discord from 'discord.js';
import * as Embed from '../template/role';
import Role from '../interface/role';
import Team from '../enum/team';
import Player from '../struct/player';
import Appearance from '../enum/appearance';
import Prompt from '../struct/prompt';

/**
 * Bodyguards are VILLAGER team role that can, once per night, protect a player from night elimination.
 */
export class Bodyguard extends Role {
  readonly name = 'Bodyguard';
  readonly pluralName = 'Bodyguards';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Villagers;

  target: Player | null = null;
  availableToProtect: Player[] = [];
  protectIndex = 0;

  startAction(): void {
    this.resetActionState();

    // Get all players we can inspect.
    this.availableToProtect = this.game.playersArray.alive;

    // Send the action prompt and start listening for reaction events.
    this.player.send(this.actionEmbed())
      .then((message) => {
        message.react('⬆️');
        message.react('⬇️');
        message.react('✅');

        // Create prompt for this message.
        this.prompt = new Prompt(message, this, (r, u) => this.reactionHandler(r, u));
      });
  }
  resetActionState(): void {
    this.target = null;
    this.availableToProtect = [];
    this.protectIndex = 0;

    if (this.prompt) {
      this.prompt.destroy();
    }
  }

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleBodyguard(this);
  }
  protected actionEmbed(): Discord.MessageEmbed {
    return Embed.ActionBodyguard(this);
  }

  private reactionHandler(react: Discord.MessageReaction, _: Discord.User): void {
    const emoji = react.emoji.name;
    const max = this.availableToProtect.length - 1;

    // If our prompt suddenly disappeared, do not proceed.
    if (!this.prompt) return;

    // No point in asking for input if there's no one to inspect.
    if (max < 0) {
      this.prompt.destroy();
    }

    switch (emoji) {
      // Previous selection.
      case '⬆️':
        this.protectIndex -= 1;
        if (this.protectIndex < 0) {
          this.protectIndex = max;
        }
        break;

      // Next selection.
      case '⬇️':
        this.protectIndex += 1;
        if (this.protectIndex > max) {
          this.protectIndex = 0;
        }
        break;

      // Confirm selection.
      case '✅':
        this.target = this.availableToProtect[this.protectIndex];
        break;

      // Invalid reaction.
      default:
        return;
    }

    // Update the prompt message.
    this.prompt.message.edit(this.actionEmbed());
  }
}
