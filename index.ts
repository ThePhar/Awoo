import * as D from "discord.js"
import * as Env from "dotenv"
import * as Template from "./template"
import Game from "./struct/game"
import Player from "./struct/player"
import { Werewolf } from "./role/werewolf"

const result = Env.config()
if (result.error)
  throw result.error

// TODO: Remove debug code.
async function start(client: D.Client): Promise<void> {
  const channelID = "697796554249076785" // #testing in Alliware.
  const memberID = "196473225268428804" // Phar

  const channel = await client.channels.fetch(channelID) as D.TextChannel
  const member = channel.members.get(memberID) as D.GuildMember
  const game = new Game(channel)
  const player = new Player(member, game)

  // // Test your embed message here.
  // if (member) {
  //   await game.announce(Template.forcedElimination(player))
  // }

  await game.announce(new D.MessageEmbed()
    .setImage("https://cdn.shopify.com/s/files/1/1239/3176/products/69920109.jpg")
    .setTitle("You are a Werewolf")
    .setColor(0xff0000)
  )
}

const client = new D.Client()
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => start(client))
  .catch((err) => console.error(err))
