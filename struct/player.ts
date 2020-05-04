import * as D from "discord.js"

export default class Player {
  public readonly member: D.GuildMember

  constructor(member: D.GuildMember) {
    this.member = member
  }
}
