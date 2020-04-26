import * as Discord from 'discord.js';
import * as Embed from '../template/role';
import Role from '../interface/role';
import Team from '../enum/team';
import Player from '../struct/player';
import Appearance from '../enum/appearance';
import Prompt from '../struct/prompt';

/**
 * Seers are VILLAGER team role that can, once per night, inspect another living villager to see if they are a
 * Werewolf or Villager.
 */
export class Seer extends Role {
  readonly name = 'Seer';
  readonly pluralName = 'Seers';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Villagers;

  inspected = new Map<string, Player>();
  target: Player | null = null;
  availableToInspect: Player[] = [];
  inspectIndex = 0;

  startAction(): void {
    this.resetActionState();

    // Get all players we can inspect.
    this.availableToInspect = this.game.playersArray.alive.filter((player) => {
      // Do not target ourselves.
      if (player.id === this.player.id) return false;

      // Do not target players that we've already inspected.
      return !this.inspected.has(player.id);
    });

    if (this.availableToInspect.length === 0) {
      this.player.send(this.actionEmbed());
      return;
    }

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
    this.availableToInspect = [];
    this.inspectIndex = 0;

    if (this.prompt) {
      this.prompt.destroy();
    }
  }

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleSeer(this);
  }
  protected actionEmbed(): Discord.MessageEmbed {
    return Embed.ActionSeer(this);
  }

  private reactionHandler(react: Discord.MessageReaction, _: Discord.User): void {
    const emoji = react.emoji.name;
    const max = this.availableToInspect.length - 1;

    // If our prompt suddenly disappeared, do not proceed.
    if (!this.prompt) return;

    // No point in asking for input if there's no one to inspect.
    if (max < 0) {
      this.prompt.destroy();
    }

    switch (emoji) {
      // Previous selection.
      case '⬆️':
        this.inspectIndex -= 1;
        if (this.inspectIndex < 0) {
          this.inspectIndex = max;
        }
        break;

      // Next selection.
      case '⬇️':
        this.inspectIndex += 1;
        if (this.inspectIndex > max) {
          this.inspectIndex = 0;
        }
        break;

      // Confirm selection.
      case '✅':
        this.target = this.availableToInspect[this.inspectIndex];
        break;

      // Invalid reaction.
      default:
        return;
    }

    // Update the prompt message.
    this.prompt.message.edit(this.actionEmbed());
  }
}
