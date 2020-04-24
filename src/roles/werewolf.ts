import * as Discord from 'discord.js';
import * as Embed from '../templates/role';
import Role from '../interfaces/role';
import Team from '../structs/team';
import Player from '../structs/player';
import Appearance from '../structs/appearance';
import Prompt from '../structs/prompt';

/**
 * Werewolves are WEREWOLF team roles that can, once per night, collectively choose a player to eliminate.
 */
export class Werewolf extends Role {
  readonly name = 'Werewolf';
  readonly pluralName = 'Werewolves';
  readonly appearance = Appearance.Werewolf;
  readonly team = Team.Werewolves;

  target: Player | null = null;
  availableToTarget: Player[] = [];
  targetIndex = 0;

  startAction(): void {
    this.resetActionState();

    // Get all players we can target.
    this.availableToTarget = this.game.playersArray.alive.filter((player) => {
      // Do not target werewolves.
      return !(player.role instanceof Werewolf);
    });

    // Send the action prompt and start listening for reaction events.
    this.player.send(this.actionEmbed())
      .then((message) => {
        message.react('⬆️');
        message.react('⬇️');
        message.react('✅');

        // Create a prompt for this message.
        this.prompt = new Prompt(message, this, this.reactionHandler);
      });
  }
  resetActionState(): void {
    this.target = null;
    this.availableToTarget = [];
    this.targetIndex = 0;

    if (this.prompt) {
      this.prompt.destroy();
    }
  }

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleWerewolf(this);
  }
  protected actionEmbed(): Discord.MessageEmbed {
    return Embed.ActionWerewolf(this);
  }

  private reactionHandler(react: Discord.MessageReaction, _: Discord.User): void {
    const emoji = react.emoji.name;
    const max = this.availableToTarget.length - 1;

    // If our prompt suddenly disappeared, do not proceed.
    if (!this.prompt) return;

    // No point in asking for input if there's no one to inspect.
    if (max < 0) {
      this.prompt.destroy();
    }

    switch (emoji) {
      // Previous selection.
      case '⬆️':
        this.targetIndex -= 1;
        if (this.targetIndex < 0) {
          this.targetIndex = max;
        }
        break;

      // Next selection.
      case '⬇️':
        this.targetIndex += 1;
        if (this.targetIndex > max) {
          this.targetIndex = 0;
        }
        break;

      // Confirm selection.
      case '✅':
        this.target = this.availableToTarget[this.targetIndex];

        // Send a message to all werewolves saying their target changed.
        this.game.playersArray.aliveWerewolves.forEach((werewolf) => {
          werewolf.send(`${this.player} has targeted ${this.target}.`);
        });
        break;

      // Invalid reaction.
      default:
        return;
    }

    // Update the prompt message for all living werewolves.
    this.game.playersArray.aliveWerewolves.forEach((werewolf) => {
      if (werewolf.role.prompt) {
        werewolf.role.prompt.message.edit(this.actionEmbed());
      }
    });
  }
}
