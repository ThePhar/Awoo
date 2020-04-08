/* eslint-disable no-undef */
import Player from '../structs/player';
import Team from '../structs/team';
import Command from '../structs/command';

interface IRole {
  readonly player: Player;
  readonly name: string;
  readonly pluralName: string;
  readonly appearance: string;
  readonly team: Team;

  action: (command: Command) => void;
}

export default IRole;
