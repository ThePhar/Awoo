import * as D from "discord.js"
import * as Env from "dotenv"
import Game, { VoteArray } from "./struct/game"
import Player from "./struct/player"
import Elimination from "./enum/elimination"
import * as Template from "./template"
import { bomberElimination } from "./template/elimination"

const result = Env.config()
if (result.error)
  throw result.error

// TODO: Remove debug code.
async function start(client: D.Client): Promise<void> {
  const channelID = "697796554249076785" // #testing in Alliware.
  const memberID = "196473225268428804" // Phar
  const member2ID = "415060065255424002" // Knear

  const channel = await client.channels.fetch(channelID) as D.TextChannel
  const member = channel.members.get(memberID) as D.GuildMember
  const member2 = channel.members.get(member2ID) as D.GuildMember
  const game = new Game(channel)
  const player = new Player(member, game)
  const contextPlayer = new Player(member2, game)

  const votes: VoteArray = [
    { player: player, count: 3 },
    { player: contextPlayer, count: 1 }
  ]

  // Test your embed message here.
  if (member && member2) {
    // await player.eliminate(Elimination.ForcedExit)
    // await player.eliminate(Elimination.Werewolf)
    // await player.eliminate(Elimination.Huntress)
    // await player.eliminate(Elimination.ToughGuyWerewolf)
    // await player.eliminate(Elimination.Vampire)
    // await player.eliminate(Elimination.Witch)
    // await player.eliminate(Elimination.TeenageWerewolfCondition)
    // await player.eliminate(Elimination.Hunter, contextPlayer)
    // await player.eliminate(Elimination.Cupid, contextPlayer)
    // await player.eliminate(Elimination.Lynching, votes)

    // Bomber
    // await game.announce(bomberElimination(contextPlayer, [player]))

    // Non-Eliminations
    await game.announce(Template.Elimination.noLynchElimination(game, votes))
    await game.announce(Template.Elimination.noNightElimination(game))
  }

  // await game.announce(new D.MessageEmbed()
  //   .setImage("https://cdn.shopify.com/s/files/1/1239/3176/products/69920109.jpg")
  //   .setTitle("You are a Werewolf")
  //   .setColor(0xff0000)
  // )
}

const client = new D.Client()
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => start(client))
  .catch((err) => console.error(err))
