import * as Discord from 'discord.js';
import * as Embed from '../template/role';
import Role from '../interface/role';
import Appearance from '../enum/appearance';
import Team from '../enum/team';

/**
 * Villagers are standard VILLAGER team role with no special actions.
 */
export class Villager extends Role {
  readonly name = 'Villager';
  readonly pluralName = 'Villagers';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Villagers;

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleVillager(this);
  }
}
