import IRole from '../interfaces/i-role';
import Player from '../structs/player';
import Team from '../structs/team';
import Appearance from '../structs/appearance';

export default class Werewolf implements IRole {
  readonly player: Player;
  readonly name = 'werewolf';
  readonly pluralName = 'werewolves';
  readonly appearance = Appearance.Werewolf;
  readonly team = Team.Werewolves;

  constructor(player: Player) {
    this.player = player;
  }
}
