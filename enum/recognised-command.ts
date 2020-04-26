import Manager from '../struct/manager';

enum RecognisedCommand {
  // Public Commands
  Join = 'join',
  Leave = 'leave',
  Rules = 'rules',
  Help = 'help',
  Accuse = 'accuse',

  // Administrator Commands
  NewGame = 'newgame',
  EndGame = 'endgame',

  // Developer Commands
  Eval = 'eval',
}

export default RecognisedCommand;

export function getCommand(s: RecognisedCommand | string) {
  return `/awoo ${s}`;
}
