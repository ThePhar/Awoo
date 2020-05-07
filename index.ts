import * as D from "discord.js"
import * as Env from "dotenv"
import Game, { VoteArray } from "./struct/game"
import Player from "./struct/player"
import * as Roles from "./role"
import Color from "./enum/color"

const result = Env.config()
if (result.error)
  throw result.error

const names = [
  "Brian Ewin",
  "Jeannine Hudgins",
  "Bert Adam",
  "Verona Hutton",
  "Lorrine Linzey",
  "Mollie Gillian",
  "Danna Tovar",
  "Marleen Larimore",
  "Monet Tjaden",
  "Rosanne Schlagel",
  "Marilee Heffernan",
  "Karry Caggiano",
  "Almeta Brochu",
  "Deena Olea",
  "Rosa Sholes",
  "Garth Troxler",
  "Ivory Memmott",
  "Kermit Blumer",
  "Ema Winner",
  "Ericka Makowski",
  "Kitty Casella",
  "Rebbecca Fike",
  "Joellen Milum",
  // "Henrietta Vinci",
  // "In Canela",
  // "Daina Lucia",
  // "Jacelyn Heim",
  // "Tesha Vanzant",
  // "Andrew Piraino",
  // "Dong Lay",
  // "Amberly Devos",
  // "Pamelia Collyer",
  // "Bettyann Flack",
  // "Jaime Fraga",
  // "Senaida Moor",
  // "Keturah Laymon",
  // "Kathyrn Stotz",
  // "Britt Galindez",
  // "Charlyn Rakestraw",
  // "Randall Hurley",
  // "Enrique Rathbone",
  // "Mathew Darland",
  // "Constance Klaus",
  // "Lupita Gladson",
  // "Denver Verrier",
  // "Polly Ramey",
  // "Cleveland Gannon",
  // "Nelson Yonker",
  // "Maryalice Lobel",
  // "Barrie Pellegrino"
]

function padName(name: string): string {
  let paddedName = name
  const left = Math.floor((32 - name.length) / 2)
  const right = Math.ceil((32 - name.length) / 2)

  paddedName = "`" + " ".repeat(left) + paddedName + " ".repeat(right) + "`"
  return paddedName
}

function generateVotes(array: string[]): D.MessageEmbed {
  const embed = new D.MessageEmbed().setColor(Color.Default)
  const numberOfFields = Math.ceil(array.length / 12)

  for (let field = 0; field < numberOfFields; field++) {
    const names: string[] = []

    for (let index = (field * 12); index < (field * 12) + 12; index++) {
      if (index >= array.length)
        break

      names.push(array[index])
    }

    const votes = names
      .map((name) => `${padName(name)} \`👉\` ${padName(array[Math.floor(Math.random() * array.length)])}`)

    if (field === 0) {
      embed.addField("Lynch Votes", votes)
    } else {
      embed.addField("Lynch Votes (cont.)", votes)
    }
  }

  return embed
}

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

  player.role = new Roles.ApprenticeSeer(player)

  const votes: VoteArray = [
    { player: player, count: 3 },
    { player: contextPlayer, count: 1 }
  ]

  if (player) {
    await player.role.startRole()
  }

  await Roles.ApprenticeSeer.printRoleSummary(game)
  // await game.announce(generateVotes(names))
}

const client = new D.Client()
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => start(client))
  .catch((err) => console.error(err))
