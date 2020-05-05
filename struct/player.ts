import * as D from "discord.js"
import Game from "./game"
import Elimination from "../enum/elimination"
import Role from "./role"

import * as EliminationTemplate from "../template/elimination"
import { Werewolf } from "../role/werewolf"

export default class Player {
  public get tag(): string { return this.member.user.tag }
  public get name(): string { return this.member.displayName }

  constructor(member: D.GuildMember, game: Game) {
    this.member = member
    this.game = game
    this.role = new Werewolf(this)
  }

  public toString = (): string => `${this.member}`

  /**
   * Eliminate this player with a specified reason.
   * @param eliminationReason The reason this player was eliminated.
   */
  public async eliminate(eliminationReason: Elimination): Promise<void> {
    switch (eliminationReason) {
      case Elimination.ForcedExit:
        await this.game.announce(EliminationTemplate.forcedElimination(this))
    }

    this.alive = false
  }

  public readonly game: Game
  public readonly member: D.GuildMember
  public alive = true
  public role: Role
}
