import * as D     from 'discord.js';
import * as Embed from '../template/role';
import Appearance from '../enum/appearance';
import Role       from '../interface/role';
import Team       from '../enum/team';

export class Tanner extends Role {
  public name       = 'Tanner';
  public pluralName = 'Tanners';
  public appearance = Appearance.Villager;
  public team       = Team.Tanner;

  protected roleDescriptionEmbed(): D.MessageEmbed {
    return Embed.RoleTanner(this);
  }
}
