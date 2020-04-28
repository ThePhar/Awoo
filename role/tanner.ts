import * as Discord from 'discord.js';
import * as Embed from '../template/role';
import Role from '../interface/role';
import Appearance from '../enum/appearance';
import Team from '../enum/team';

/**
 * Tanners are a TANNER team role that only win if they are eliminated.
 */
export class Tanner extends Role {
  readonly name = 'Tanner';
  readonly pluralName = 'Tanners';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Tanner;

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleTanner(this);
  }
}
