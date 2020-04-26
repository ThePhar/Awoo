import * as Discord from 'discord.js';
import * as Embed from '../template/role';
import Role from '../interface/role';
import Appearance from '../enum/appearance';
import Team from '../enum/team';

/**
 * Mayors are standard VILLAGER team role with that get counted twice for the purposes of lynching others.
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
