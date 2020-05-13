   import * as D from "discord.js"
import Game, { Vote } from "./game"
import Elimination, { EliminationContext, EliminationsWithNoContext } from "../enum/elimination"
import Role from "./role"

import * as EliminationTemplate from "../template/elimination"
import * as Roles from "../role"

export default class Player {
  public readonly game: Game
  public readonly member: D.GuildMember
  public accusation: Player | null = null
  public alive = true
  public role: Role

  constructor(member: D.GuildMember, game: Game) {
    this.member = member
    this.game = game
    this.role = new Roles.Villager(this)
  }

  public toString = (): string => `${this.member}`

  /**
   * Eliminate this player with a specified reason.
   * @param eliminationReason The reason this player was eliminated.
   */
  public async eliminate(eliminationReason: EliminationsWithNoContext): Promise<void>
  public async eliminate(eliminationReason: Elimination.Hunter, hunter: Player): Promise<void>
  public async eliminate(eliminationReason: Elimination.Cupid, lover: Player): Promise<void>
  public async eliminate(eliminationReason: Elimination.Lynching, votes: Vote[]): Promise<void>
  public async eliminate(eliminationReason: Elimination, additionalContext?: EliminationContext): Promise<void> {
    switch (eliminationReason) {
      case Elimination.ForcedExit:
        await this.game.announce(EliminationTemplate.forcedElimination(this))
        break
      case Elimination.Werewolf:
        await this.game.announce(EliminationTemplate.werewolfElimination(this))
        break
      case Elimination.Huntress:
        await this.game.announce(EliminationTemplate.huntressElimination(this))
        break
      case Elimination.ToughGuyWerewolf:
        await this.game.announce(EliminationTemplate.toughGuyElimination(this))
        break
      case Elimination.Vampire:
        await this.game.announce(EliminationTemplate.vampireElimination(this))
        break
      case Elimination.Witch:
        await this.game.announce(EliminationTemplate.witchElimination(this))
        break
      case Elimination.TeenageWerewolfCondition:
        await this.game.announce(EliminationTemplate.teenageWerewolfEffectElimination(this))
        break
      case Elimination.Hunter:
        await this.game.announce(EliminationTemplate.hunterElimination(this, additionalContext as Player))
        break
      case Elimination.Cupid:
        await this.game.announce(EliminationTemplate.cupidElimination(this, additionalContext as Player))
        break
      case Elimination.Lynching:
        await this.game.announce(EliminationTemplate.lynchElimination(this, additionalContext as Vote[]))
        break
    }

    // They need to die, obviously!
    this.alive = false
  }

  public get id(): string { return this.member.id }
  public get tag(): string { return this.member.user.tag }
  public get name(): string { return this.member.displayName }
}
