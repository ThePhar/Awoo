import * as D from "discord.js"
import Appearance from "../enum/appearance"
import Player from "../struct/player"
import Role from "../struct/role"
import Team from "../enum/team"
import fullAnnouncementEmbed from "../template"

export class Werewolf extends Role {
  public name = "Werewolf"
  public appearance = Appearance.Werewolf
  public team = Team.Werewolves

  /* Werewolf Specific Fields */
  availableToTarget: Player[] = []
  targetIndex = 0
  target?: Player

  public startAction = async(): Promise<void> => {
    this.resetActionState()

    // TODO: Write this logic.
    await new Promise((resolve) => resolve())
  }

  public resetActionState = (): void => {
    this.availableToTarget = []
    this.targetIndex = 0
    this.target = undefined
  }

  public roleEmbed = (): D.MessageEmbed => fullAnnouncementEmbed(this.game)
    .setTitle("You Are A Werewolf")
    .setDescription("")
  public actionEmbed = undefined
}
