import Player from './player';
import Game from './game';
import RecognisedCommands from './recognised-commands';

export default class Command {
  readonly type: string | RecognisedCommands;
  readonly targets: Player[];
  readonly error: string | null;

  constructor(command: string, targets: Player[], error: string | null) {
    this.type = command;
    this.targets = targets;
    this.error = error;
  }

  /**
   * Receives a potential command string and returns a custom Command object with the targets of a
   * particular command.
   * @param string The potential command string.
   * @param game The game object for which this command was sent through.
   */
  static parse(string: string, game: Game): Command | undefined {
    // Check for the prefix.
    if (string.startsWith(game.commandPrefix)) {
      // Lowercase, trim, and split our array for simple evaluation later.
      const stringArray = string.toLowerCase().trim().split(' ');

      // Get our command string without the prefix.
      let command = stringArray.shift() as string;
      command = command.replace(game.commandPrefix, '');

      // Get our target string.
      let target = stringArray.join(' ');

      // Regex for checking for evaluating Discord Mentions.
      const regex = /<@!?([0-9]+)>/;
      if (regex.test(string)) {
        // Attempt to find a player by their id.
        [, target] = (regex.exec(string) as RegExpExecArray);
        const player = game.getPlayer(target);

        // Return our command with the targeted player.
        if (player) {
          return new Command(command, [player], null);
        }

        // If player didn't exist, just send an empty array.
        return new Command(command, [], null);
      }

      // If a Discord Mention string wasn't used as a target, find by their tag.
      const { players, error } = game.findPlayers(target);
      return new Command(command, players, error);
    }

    // Command was parsed incorrectly.
    return undefined;
  }
}
