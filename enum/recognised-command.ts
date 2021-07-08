enum RecognisedCommand {
  // Public Commands
  Join = 'join',
  Leave = 'leave',
  Rules = 'rules',
  Help = 'help',
  Accuse = 'accuse',
  Tally = 'tally',
  RemoveAccusation = 'clear',
  Commands = 'commands',

  // Administrator Commands
  NewGame = 'newgame',
  EndGame = 'endgame',
}

export default RecognisedCommand;

export function getCommand(s: RecognisedCommand | string) {
  return `/awoo ${s}`;
}
