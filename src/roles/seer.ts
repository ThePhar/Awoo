import Team from '../structs/team';
import Appearance from '../structs/appearance';
import Villager from './villager';

export default class Seer extends Villager {
  readonly name = 'seer';
  readonly pluralName = 'seers';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Villagers;
}
