import IRole from '../interfaces/i-role';
import Player from '../structs/player';
import Team from '../structs/team';
import Appearance from '../structs/appearance';

export default class Villager implements IRole {
  player: Player;
  name = 'villager';
  pluralName = 'villagers';
  appearance = Appearance.Villager;
  team = Team.Villagers;

  constructor(player: Player) {
    this.player = player;
  }
}
