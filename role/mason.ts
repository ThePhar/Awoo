import * as D       from 'discord.js'
import * as Embed   from '../template/role'
import Appearance   from '../enum/appearance'
import Team         from '../enum/team'
import { Villager } from './villager';

export class Mason extends Villager {
  public name       = 'Mason'
  public pluralName = 'Masons'
  public appearance = Appearance.Villager
  public team       = Team.Villagers

  protected roleDescriptionEmbed(): D.MessageEmbed {
    return Embed.RoleMason(this)
  }
}
