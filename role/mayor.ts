import * as D       from 'discord.js';
import * as Embed   from '../template/role';
import Appearance   from '../enum/appearance';
import Team         from '../enum/team';
import { Villager } from './villager';

export class Mayor extends Villager {
  public name       = 'Mayor';
  public pluralName = 'Mayors';
  public appearance = Appearance.Villager;
  public team       = Team.Villagers;

  protected roleDescriptionEmbed(): D.MessageEmbed {
    return Embed.RoleMayor(this);
  }
}
