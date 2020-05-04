import * as D from "discord.js"
import * as Env from "dotenv"
import * as Template from "./template"
import Game from "./struct/game"

const result = Env.config()
if (result.error)
  throw result.error

// TODO: Remove debug code.
async function start(client: D.Client): Promise<void> {
  const channelID = "697796554249076785" // #testing in Alliware.
  const memberID = "196473225268428804" // Phar

  const channel = await client.channels.fetch(channelID) as D.TextChannel
  const member = channel.members.get(memberID)
  const game = new Game(channel)

  // Test your embed message here.
  if (member) {
    await game.announce(Template.playerAddDMCheck(game, member))
    await game.announce(Template.playerAlreadyExists(game, member))
    await game.announce(Template.gameInProgress(game, member))
    await game.announce(Template.maxPlayersReached(game, member))
    await game.announce(Template.unableToDMPlayer(game, member))
    await game.announce(Template.success(game, member))
  }
}

const client = new D.Client()
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => start(client))
  .catch((err) => console.error(err))
