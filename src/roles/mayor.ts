import * as Discord from 'discord.js';
import * as Embed from '../templates/role';
import Role from '../interfaces/role';
import Appearance from '../structs/appearance';
import Team from '../structs/team';

/**
 * Mayors are standard VILLAGER team roles with that get counted twice for the purposes of lynching others.
 */
export class Mayor extends Role {
  readonly name = 'Mayor';
  readonly pluralName = 'Mayors';
  readonly appearance = Appearance.Villager;
  readonly team = Team.Villagers;

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleMayor(this);
  }
}
