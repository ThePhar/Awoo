/* eslint-disable no-undef */
import Player from '../structs/player';
import Team from '../structs/team';

interface IRole {
  readonly player: Player;
  readonly name: string;
  readonly pluralName: string;
  readonly appearance: string;
  readonly team: Team;
}

export default IRole;
