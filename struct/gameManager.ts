import dedent from "dedent"
import Schedule from "node-schedule"
import * as Discord from "discord.js"
import * as Template from "../template"
import Player from "./player"
import GameState from "./gameState"
import Settings from "./settings"
import Phase from "../enum/phase"
import Elimination from "../enum/elimination"
import Team from "../enum/team"

export type Vote = { count: number; target: Player }
const RequiredPermissions: Discord.PermissionResolvable = [
    "MANAGE_CHANNELS",
    "EMBED_LINKS",
    "SEND_MESSAGES",
    "MANAGE_ROLES",
    "READ_MESSAGE_HISTORY",
    "ADD_REACTIONS",
    "MANAGE_MESSAGES",
    "USE_EXTERNAL_EMOJIS",
]

export default class GameManager {
    public readonly bot: Discord.Client
    public readonly channel: Discord.TextChannel
    public active = false
    public banned = new Set<Discord.Snowflake>()
    public players = new Map<Discord.Snowflake, Player>()
    public state: Readonly<GameState> = new GameState()
    public settings: Readonly<Settings> = new Settings()
    public activeMessages: Discord.Message[] = []
    public scheduler: Schedule.Job = new Schedule.Job("None Scheduled")

    private constructor(channel: Discord.TextChannel, bot: Discord.Client) {
        this.channel = channel
        this.bot = bot
    }

    /** Create a new game if the bot can manage it correctly. */
    public async instantiate(channel: Discord.TextChannel, bot: Discord.Client): Promise<GameManager | undefined> {
        if (!this.botHasRequiredPermissions()) {
            await channel.send(dedent(`
                Sorry, but I cannot instantiate a game in this channel without the following permissions:
                
                \`\`\`
                ${(RequiredPermissions as Array<string>).join("\n")}
                \`\`\`
            `))
            return undefined
        }

        // TODO: Move to separate template file.
        await channel.send("A game has been instantiated for this channel, but has not been started. After you configure this game to your desired settings, run `/awoo start` to allow players to join and start the game.")
        return new GameManager(channel, bot)
    }
    /** Check if the bot can perform all actions it needs. */
    private botHasRequiredPermissions(): boolean {
        // If we don't have a valid user, then we DEFINITELY do not have permission.
        if (!this.bot.user)
            return false

        // Check if we have the correct permissions.
        const perms = this.channel.permissionsFor(this.bot.user)
        return !!(perms && (perms.has("ADMINISTRATOR") || perms.has(RequiredPermissions)))
    }

    /** Get a the discord link to this channel. */
    public toString = (): string => this.channel.toString()

    /** Send a message to the game channel. */
    public async send(content: string | Discord.MessageEmbed): Promise<Discord.Message> {
        return this.channel.send(content)
    }
    /** Send a message to the game channel and the announcements channel if it exists. */
    public async announce(content: string | Discord.MessageEmbed): Promise<Discord.Message[]> {
        const messages: Discord.Message[] = []
        messages.push(await this.send(content))

        if (this.settings.announcementChannelId) {
            const announce = await this.bot.channels.fetch(this.settings.announcementChannelId) as Discord.TextChannel
            messages.push(await announce.send(content))
        }

        return messages
    }
    /** Send a message to the spoiler channel if it exists. */
    public async spoiler(content: string | Discord.MessageEmbed): Promise<Discord.Message | void> {
        if (this.settings.spoilerChannelId) {
            const spoiler = await this.bot.channels.fetch(this.settings.spoilerChannelId) as Discord.TextChannel
            return spoiler.send(content)
        }
    }

    /** Check if a player is able to join a game and add them to the next upcoming game if allowed. */
    public async playerJoin(member: Discord.GuildMember): Promise<void> {
        const { phase } = this.state

        // Do not add any player that is banned from joining an upcoming game.
        if (this.banned.has(member.id)) {
            await this.send(Template.PlayerJoin.bannedPlayer(this, member))
            return
        }

        // Do not add a player if the player has already joined.
        if (this.players.has(member.id)) {
            await this.send(Template.PlayerJoin.playerAlreadyExists(this, member))
            return
        }

        // Do not add players if a game is in progress.
        if (phase !== Phase.WaitingForPlayers) {
            await this.send(Template.PlayerJoin.gameInProgress(this, member))
            return
        }

        // Do not add a player if they do not accept DMs.
        try {
            await member.send(Template.PlayerJoin.playerAddDMCheck(this, member))
        } catch {
            await this.send(Template.PlayerJoin.unableToDMPlayer(this, member))
            return
        }

        await this.send(Template.PlayerJoin.successfulJoin(this, member))
        this.setPlayer(member)
    }
    /** Remove a player from the game. If they are in an on-going game, forcefully eliminate them. */
    public async playerLeave(member: Discord.GuildMember): Promise<void> {
        const player = this.players.get(member.id)

        // If we couldn't find a player, it means they were not in the game to begin with.
        if (!player) {
            await this.send(Template.PlayerLeave.playerDoesNotExist(this, member))
            return
        }

        // Kill this player if they were already alive.
        if (player.alive) {
            await player.eliminate(Elimination.ForcedExit)

            // TODO: Check for win condition.
        }

        await this.send(Template.PlayerLeave.successfulLeave(this, member))
        this.deletePlayer(member)
    }

    /** Check for a win condition and return winning team, if any. */
    private getVictoryCondition(): Team | null {
        const players = [...this.players.entries()].map(([, player]) => player)
        const villagerCount = players.filter((p) => p.alive && !p.role.isWerewolf).length
        const werewolfCount = players.filter((p) => p.alive && p.role.isWerewolf).length

        if (villagerCount === 0 || werewolfCount >= villagerCount)
            return Team.Werewolves
        if (werewolfCount === 0)
            return Team.Villagers

        return null
    }

    /** Find all players that match a particular substring or identifier */
    public findPlayers(identifier: string): Player[] {
        const players: Player[] = []

        // Do not attempt a search if identifier empty.
        if (identifier.trim() === "")
            return players

        // Determine if we were supplied a discord mention identifier or a name.
        const discordMentionFormat = /^<@!?([0-9]+)>$/
        if (discordMentionFormat.test(identifier)) {
            const match = discordMentionFormat.exec(identifier) as RegExpExecArray
            const player = this.players.get(match[1])

            return player ? [player] : []
        }

        // Make our substring case-insensitive.
        const substring = identifier.toLowerCase()
        this.players.forEach((player) => {
            // More case-insensitive setup.
            const tag = player.tag.toLowerCase()
            const displayName = player.name.toLowerCase()

            if (tag.includes(substring) || displayName.includes(substring))
                players.push(player)
        })

        return players
    }
    /** Add/Update a player in the game. */
    private setPlayer(member: Discord.GuildMember): void {
        this.players.set(member.id, new Player(member, this))
    }
    /** Delete a player from the game. */
    private deletePlayer(id: Discord.Snowflake): void
    private deletePlayer(member: Discord.GuildMember): void
    private deletePlayer(identifier: Discord.GuildMember | Discord.Snowflake): void {
        if (identifier instanceof Discord.GuildMember)
            this.players.delete(identifier.id)
        else
            this.players.delete(identifier)
    }

    /** Get a sorted list of all votes currently made by players, sorted by most to least votes. */
    private getLynchVotes(): Vote[] {
        const votes = new Map<Discord.Snowflake, Vote>()

        // Count each vote.
        this.players.forEach((player) => {
            if (player.alive && player.accusation) {
                const increment = 1
                const vote = votes.get(player.accusation.id) || { count: 0, target: player.accusation }

                vote.count += increment
                votes.set(player.accusation.id, vote)
            }
        })

        // Convert to an array and sort by vote count.
        return [...votes.entries()]
            .sort((a, b) => b[1].count - a[1].count)
            .map(([, element]) => element)
    }
    /** Get a sorted list of all targets made by werewolves. */
    private getWolfVotes(): Vote[] {
        const targets = new Map<Discord.Snowflake, Vote>()

        // Count each targeted player.
        this.players.forEach((player) => {
            if (player.alive && player.role.isWerewolf && player.role.targets.length > 1) {
                // Werewolves might be able to target multiple players, so let's ensure we check all of them.
                for (const targetPlayer of player.role.targets) {
                    const increment = 1
                    const target = targets.get(targetPlayer.id) || { count: 0, target: targetPlayer }

                    target.count += increment
                    targets.set(targetPlayer.id, target)
                }
            }
        })

        // Convert to an array and sort by vote count.
        return [...targets.entries()]
            .sort((a, b) => b[1].count - a[1].count)
            .map(([, element]) => element)
    }

    public get name(): string { return this.channel.name }
    public get playerCount(): number { return this.players.size }
    public get guild(): string { return this.channel.guild.name }
    public get iconURL(): string { return this.channel.guild.iconURL() || "" }
}
