import Team from '../structs/team';
import Appearance from '../structs/appearance';
import Villager from './villager';
import Player from '../structs/player';
import Command from '../structs/command';
import RecognisedCommands from '../structs/recognised-commands';
import Phase from '../structs/phase';

export default class Seer extends Villager {
  readonly name = 'seer';
  readonly pluralName = 'seers';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Villagers;

  inspected = new Map<string, Player>();
  currentTarget?: Player;

  /**
   * Handle the command logic for the Seer.
   * @param command The command object.
   */
  action(command: Command): void {
    // Only check for inspection commands.
    if (command.type === RecognisedCommands.Target) {
      const { game } = this.player;

      // Player cannot target outside of night phase.
      if (game.phase !== Phase.Night) {
        this.player.message('You cannot target players outside of the night phase.');
        return;
      }

      // Player must target someone.
      if (command.error === 'No arguments') {
        this.player.message('Please supply a name for your target.');
        return;
      }

      // Player must find a target.
      if (command.targets.length === 0) {
        this.player.message('I could not find a player under that name.');
        return;
      }

      // Player must target only 1 player.
      if (command.targets.length > 1) {
        this.player.message('I found multiple players under that name. Can you be more specific?');
        return;
      }

      const [target] = command.targets;
      // Player cannot target themselves.
      if (target.id === this.player.id) {
        this.player.message('You cannot target yourself.');
        return;
      }

      // Player cannot target players they have already inspected.
      if (this.inspected.has(target.id)) {
        this.player.message(`You have already inspected ${target}, they were a ${target.role.appearance}.`);
        return;
      }

      // Player cannot target eliminated players.
      if (!target.alive) {
        this.player.message('You cannot target eliminated players.');
        return;
      }

      // Should be a valid command!
      this.currentTarget = target;
      this.player.message(
        `You are now inspecting ${this.currentTarget}. You will be notified of their role if you survive the night.`,
      );
    }
  }
}
