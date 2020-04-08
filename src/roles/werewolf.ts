import IRole from '../interfaces/i-role';
import Player from '../structs/player';
import Team from '../structs/team';
import Appearance from '../structs/appearance';
import Command from '../structs/command';
import RecognisedCommands from '../structs/recognised-commands';
import Phase from '../structs/phase';

export default class Werewolf implements IRole {
  readonly player: Player;
  readonly name = 'werewolf';
  readonly pluralName = 'werewolves';
  readonly appearance = Appearance.Werewolf;
  readonly team = Team.Werewolves;

  currentTarget?: Player;

  constructor(player: Player) {
    this.player = player;
  }

  /**
   * Handle the command logic for the Werewolves.
   * @param command The command object.
   */
  action(command: Command): void {
    if (command.type === RecognisedCommands.Target) {
      const { game } = this.player;

      // Player cannot target outside of night phase.
      if (game.phase !== Phase.Night) {
        this.player.message('You cannot target players outside of the night phase.');
        return;
      }

      // Player cannot target on first night.
      if (game.day === 1) {
        this.player.message('You cannot target players on the first night.');
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

      // Player cannot target eliminated players.
      if (!target.alive) {
        this.player.message('You cannot target eliminated players.');
        return;
      }

      // Player cannot target other werewolves.
      if (target.role instanceof Werewolf) {
        this.player.message('You cannot target other werewolves.');
        return;
      }

      // Should be a valid command!
      this.currentTarget = target;
      // TODO: Send message to all werewolves about targeting.
    }
  }
}
