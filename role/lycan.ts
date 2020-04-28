import * as Discord from 'discord.js';
import * as Embed from '../template/role';
import Role from '../interface/role';
import Appearance from '../enum/appearance';
import Team from '../enum/team';

/**
 * Lycans are standard VILLAGER team role that appear to the seer as a werewolf.
 */
export class Lycan extends Role {
  readonly name = 'Lycan';
  readonly pluralName = 'Lycans';
  readonly appearance = Appearance.Werewolf;
  readonly team = Team.Villagers;

  protected roleDescriptionEmbed(): Discord.MessageEmbed {
    return Embed.RoleLycan(this);
  }
}
