import * as Discord from 'discord.js';
import * as Embed from '../templates/role';
import Role from '../interfaces/role';
import Appearance from '../structs/appearance';
import Team from '../structs/team';

/**
 * Villagers are standard VILLAGER team roles with no special actions.
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
