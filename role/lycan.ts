import * as D       from 'discord.js';
import * as Embed   from '../template/role';
import Appearance   from '../enum/appearance';
import Team         from '../enum/team';
import { Villager } from './villager';

export class Lycan extends Villager {
  public name       = 'Lycan';
  public pluralName = 'Lycans';
  public appearance = Appearance.Werewolf;
  public team       = Team.Villagers;

  protected roleDescriptionEmbed(): D.MessageEmbed {
    return Embed.RoleLycan(this);
  }
}
