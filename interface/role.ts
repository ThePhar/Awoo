import * as Discord from 'discord.js';
import Player from '../struct/player';
import Team from '../enum/team';
import Prompt from '../struct/prompt';

export default abstract class Role {
  readonly player: Player;
  prompt: Prompt | null;

  abstract readonly name: string;
  abstract readonly pluralName: string;
  abstract readonly appearance: string;
  abstract readonly team: Team;

  constructor(player: Player) {
    this.player = player;
    this.prompt = null;
  }

  startRole(): void {
    this.player.send(this.roleDescriptionEmbed());
  }

  startAction(): void {}
  resolveAction(): void {}
  resetActionState(): void {}

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    throw new Error('Role description not implemented.');
  }
  protected actionEmbed(): Discord.MessageEmbed {
    throw new Error('Action description not implemented.');
  }

  get game() { return this.player.game; }
}
