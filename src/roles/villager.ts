import IRole from '../interfaces/i-role';
import Player from '../structs/player';
import Team from '../structs/team';
import Appearance from '../structs/appearance';
import Command from '../structs/command';

export default class Villager implements IRole {
  player: Player;
  name = 'villager';
  pluralName = 'villagers';
  appearance = Appearance.Villager;
  team = Team.Villagers;

  constructor(player: Player) {
    this.player = player;
  }

  // eslint-disable-next-line class-methods-use-this
  action(_: Command): void {}
}
