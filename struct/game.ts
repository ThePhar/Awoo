/* eslint-disable max-len */
import dedent     from 'dedent'
import Schedule   from 'node-schedule'
import Moment     from 'moment'
import * as D     from 'discord.js'
import * as Embed from '../template/game'
import * as Roles from '../role'
import * as Time  from '../util/date'
import Manager    from './manager'
import Player     from './player'
import Phase      from '../enum/phase'
import Shuffle    from '../util/shuffle'

/* Constants */
const RequiredPermissions: D.PermissionResolvable = [
  'MANAGE_CHANNELS',
  'EMBED_LINKS',
  'SEND_MESSAGES',
  'MANAGE_ROLES',
  'READ_MESSAGE_HISTORY',
  'ADD_REACTIONS',
  'MANAGE_MESSAGES',
  'USE_EXTERNAL_EMOJIS',
]

/* Types */
export type PlayerMap = Map<string, Player>
export type PlayerArray = {
  all: Player[],
  alive: Player[],
  eliminated: Player[]
}
export type Players = {
  all: Player[],
  alive: Player[],
  eliminated: Player[],
  role: { [key: string]: PlayerArray },
}

export default class Game {
  /* Public Fields */
  public readonly channel: D.TextChannel
  public readonly manager: Manager
  public day             = 0
  public phase           = Phase.Waiting
  public allowVoteChange = true

  /* Private Fields */
  private          message:   D.Message
  private          phaseMsg?: D.Message
  private          schedule?: Schedule.Job
  private          reminder?: Schedule.Job
  private          playerMap: PlayerMap = new Map<string, Player>()
  private          playerMax: number    = 50
  private          playerMin: number    = 6

  private readonly defaultPerms: D.Collection<string, D.PermissionOverwrites>

  /* Constructor */
  private constructor(channel: D.TextChannel, manager: Manager, message: D.Message) {
    this.channel = channel
    this.manager = manager
    this.message = message
    this.defaultPerms = channel.permissionOverwrites

    this.updateStatus()
      .catch(() => this.channel.send('Failed to update channel topic.'))
      .catch((err) => console.log(`Failed to send message in ${this.channel.name}.`, err))
  }

  /* Static Methods */
  /**
   * Do a check to see if we have all the valid permissions required to start a game in this channel, and if so, create
   * it.
   * @param channel The Discord TextChannel to use for this game.
   * @param manager The Manager handling this game.
   */
  public static async generateGame(channel: D.TextChannel, manager: Manager): Promise<Game | undefined> {
    // Do not continue if we have no user object for this bot.
    if (!manager.client.user) {
      return undefined
    }

    // Check our permissions and create a game if they are good..
    const perms = channel.permissionsFor(manager.client.user)
    if (perms && (perms.has('ADMINISTRATOR') || perms.has(RequiredPermissions))) {
      const message = await channel.send(Embed.lobby())
      await message.pin()
      return new Game(channel, manager, message)
    }

    // We do not have the correct level of permissions, tell them!
    await channel.send(dedent(`
      Sorry, but I need a minimum level of permissions to start and manage a game in this channel.
      
      Required Permissions:
      \`\`\`
      Manage Channel
      Manage Permissions
      Read Messages
      Send Messages
      Manage Messages
      Embed Links
      Read Message History
      Use External Emojis
      Add Reactions
      \`\`\`
    `))
    return undefined
  }

  /* Async Methods */
  /**
   * Add a player to this game.
   * @param member The Discord member who signed up.
   */
  public async addPlayer(member: D.GuildMember): Promise<Player | undefined> {
    let player = this.getPlayer(member.id)

    // Do not allow player to join multiple times.
    if (player) {
      await this.announce(`${member}, you are already a player in this game!`)
      return undefined
    }
    // Do not allow joins while game is in progress.
    if (this.phase !== Phase.Waiting) {
      await this.announce(`Sorry ${member}, but you cannot join a game in progress.`)
      return undefined
    }
    // Do not allow joins if all player slots are filled.
    if (this.playerCount >= this.playerMax) {
      await this.announce(
        `Sorry, ${member}, but we already have the max number of allowed players (${this.playerMax}).`,
      )
      return undefined
    }

    // Create our player and add it to our game.
    try {
      // Attempt to send a message to this user. If it fails, do not add this user.
      await member.send(`You have joined the next game in ${this.channel}, ${member}.`)

      // Add our player.
      player = new Player(member, this)
      this.playerMap.set(member.id, player)
      await this.announce(`${member} has signed up for the next game.`)

      // If we passed the threshold of minimum players, schedule the game to start.
      if (this.playerCount >= this.playerMin && !this.schedule) {
        this.schedule = Schedule.scheduleJob(Time.getNextNight().add(1, 'day').toDate(), this.startNewGame.bind(this))
        await this.announce('Minimum number of players signed up reached. Scheduling to start the game...')
      }

      // Update the channel details.
      await this.message.edit(Embed.lobby(this))
      await this.updateStatus()
    } catch {
      // Failed to add. Most likely caused by no permissions to DM a user.
      await this.announce(`${member}, you must allow DMs from users in this server to join this game.`)
    }

    return player
  }
  /**
   * Send a message to the game channel.
   * @param content The message content to send.
   */
  public async announce(content: string | D.MessageEmbed): Promise<D.Message> {
    return this.channel.send(content)
  }
  /**
   * Remove a player from this game if they are already signed up.
   * @param member The discord member to remove from game.
   */
  public async removePlayer(member: D.GuildMember): Promise<void> {
    const player = this.playerMap.get(member.id)

    if (player) {
      this.playerMap.delete(member.id)

      // Update the channel details.
      await this.message.edit(Embed.lobby(this))
      await this.updateStatus()
      await this.announce(`${member} is no longer signed up for the next game.`)

      // Unschedule the game if we went under the threshold again.
      if (this.playerCount < this.playerMin && this.schedule) {
        this.clearSchedules()
        await this.announce('Player count is under threshold. Cancelling scheduled game start.')
        return
      }
    }

    // Player did not exist.
    await this.announce(`${member}, you were already not signed up.`)
  }
  /**
   * Remove this game from the Manager and reset the channel to its default settings.
   */
  private async destroyGame(): Promise<void> {
    this.clearSchedules()
    this.manager.games.delete(this.id)

    // Restore previous channel state.
    await this.channel.overwritePermissions(this.defaultPerms)
  }
  /**
   * Checks if a win condition was met for any team.
   */
  private async hasVictoryOccurred(): Promise<boolean> {
    const { players } = this
    const villagerCount = players.alive.filter((p) => p.alive && p.role instanceof Roles.Villager).length
    const werewolfCount = players.alive.filter((p) => p.alive && p.role instanceof Roles.Werewolf).length
    const tannerElimination = !!(players.role[Roles.Tanner.name]?.eliminated.length)

    // Tanner Win Condition
    if (tannerElimination) {
      await this.announce(Embed.tannerWin(this))
      await this.updateStatus()
      return true
    }

    // Werewolf Win Condition
    if (villagerCount === 0 || werewolfCount >= villagerCount) {
      await this.announce(Embed.werewolfWin(this))
      await this.updateStatus()
      return true
    }

    // Villager Win Condition
    if (werewolfCount === 0) {
      await this.announce(Embed.villagerWin(this))
      await this.updateStatus()
      return true
    }

    // No Win Condition
    return false
  }
  /**
   * Eliminate the player with the most accusations.
   */
  private async processLynchings(): Promise<void> {
    // Go through each player and tally up the votes.
    const votes = new Map<Player, number>()

    // Start counting each player.
    this.players.alive.forEach((player) => {
      // Only count players who made an accusation.
      if (player.accusing) {
        const count = votes.get(player.accusing) || 0
        // Increment by 2 if player is a Mayor. Otherwise, 1.
        const increment = player.role instanceof Roles.Mayor ? 2 : 1

        // Count the votes.
        votes.set(player.accusing, count + increment)
      }
    })

    // Convert to an array and sort by number of votes.
    const sorted = [...votes.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([player, count]) => ({ player, count }))

    // Lynch the player with the most votes (or only votes).
    if (sorted.length === 1 || (sorted.length > 1 && sorted[0].count > sorted[1].count)) {
      // Do not lynch the Prince.
      if (sorted[0].player.role instanceof Roles.Prince) {
        await this.announce(Embed.princeLynch(this, sorted))
        return
      }

      await this.announce(Embed.lynch(this, sorted))
      sorted[0].player.eliminate()
      return
    }

    // If we got here, we were unable to lynch anyone.
    await this.announce(Embed.noLynch(this, sorted))
  }
  /**
   * Begin day phase.
   */
  private async startDayPhase(): Promise<void> {
    // Set phase variables.
    this.phase = Phase.Day
    this.allowVoteChange = true

    let eliminations = false
    // Process Night Eliminations
    if (this.day !== 1) {
      const target = this.werewolfNightAction()
      const witchSave = this.witchNightAction()

      // Check if body guard was protecting, otherwise eliminate the player.
      if (target && !witchSave) {
        // TODO: Rewrite this logic to work with multiple bodyguards.
        // eslint-disable-next-line no-restricted-syntax
        for (const bodyguard of this.players.role[Roles.Bodyguard.name]?.alive) {
          const bodyguardRole = bodyguard.role as Roles.Bodyguard

          if (bodyguardRole.target && bodyguardRole.target.id === target.id) {
            bodyguard.send('The player you protected was selected by the werewolves, but did not die because of you.')
          } else {
            target.eliminate()
            eliminations = true
            this.announce(Embed.werewolf(target))
          }
        }
      }

      if (!eliminations) {
        await this.announce(Embed.noNightElim())
      }
    }

    // Check for win conditions.
    if (await this.hasVictoryOccurred()) {
      await this.destroyGame()
      return
    }

    // Update Game Status
    await this.updateStatus()

    // Process Inspections
    await this.seerNightAction()
    await this.sorceressNightAction()

    // Schedule the next phase.
    const duskTime = Time.getNextNight()
    this.schedule = Schedule.scheduleJob(duskTime.toDate(), this.startNightPhase.bind(this))
    this.reminder = Schedule.scheduleJob(duskTime.subtract(1, 'hour').toDate(), this.startReminder.bind(this))

    const phaseMsg = await this.announce(Embed.day(this))

    // Unpin the last phase message if it exists and pin the new one.
    if (this.phaseMsg) {
      await this.phaseMsg.unpin()
    }

    this.phaseMsg = phaseMsg
    await this.phaseMsg.pin()
  }
  /**
   * Start the game!
   */
  private async startNewGame(): Promise<void> {
    // Set everyone's roles.
    this.randomizeRoles()

    // Mute all non-players and set rate limit.
    await this.channel.updateOverwrite(this.channel.guild.roles.everyone, { SEND_MESSAGES: false })
    await this.channel.setRateLimitPerUser(5)

    // Send everyone their role and unmute them.
    this.playerMap.forEach((player) => {
      this.channel.updateOverwrite(player.member, { SEND_MESSAGES: true })
      player.role.startRole()
    })

    // Start the night!
    await this.startNightPhase()
  }
  /**
   * Begin night phase.
   */
  private async startNightPhase(): Promise<void> {
    // Set phase variables.
    this.day += 1
    this.phase = Phase.Night

    // Process Lynch Eliminations (but not on the first night).
    if (this.day !== 1) {
      this.processLynchings()
    }

    // Check for win conditions.
    if (await this.hasVictoryOccurred()) {
      await this.destroyGame()
      return
    }

    // Update Game Status
    await this.updateStatus()

    // Clear accusations and start night action.
    this.playerMap.forEach((player) => {
      player.clearAccusation()

      if (player.alive) {
        player.role.startAction()
      }
    })

    // Schedule the next phase.
    const dawnTime = Time.getNextMorning()
    this.schedule = Schedule.scheduleJob(dawnTime.toDate(), this.startDayPhase.bind(this))
    this.reminder = Schedule.scheduleJob(dawnTime.subtract(1, 'hour').toDate(), this.startReminder.bind(this))

    const phaseMsg = await this.announce(Embed.night(this))

    // Unpin the last phase message if it exists and pin the new one.
    if (this.phaseMsg) {
      await this.phaseMsg.unpin()
    }

    this.phaseMsg = phaseMsg
    await this.phaseMsg.pin()
  }
  /**
   * Update the topic of the channel with the current status of the game depending on the phase in progress.
   */
  private async updateStatus(): Promise<void> {
    const emoji = '<:werewolf:667194685374332969>' // TODO: Make a enum for all these emojis.
    const p = this.players
    let status: string

    // Update status message based on Phase.
    switch (this.phase) {
      case Phase.Waiting:
        status = `${emoji} Waiting For Players - [ ${this.playerCount}/${this.playerMax} Ready ]`
        break

      case Phase.Day:
        status = `${emoji} Day ${this.day} - [ ${p.alive.length} Alive / ${p.eliminated.length} Eliminated ]`
        break

      case Phase.Night:
        status = `${emoji} Night ${this.day} - [ ${p.alive.length} Alive / ${p.eliminated.length} Eliminated ]`
        break

      default:
        status = 'Unknown Status'
    }

    await this.channel.setTopic(status)
  }
  /**
   * Print a reminder message and update state for voting if needed.
   */
  private async startReminder(): Promise<void> {
    const playerReminders = this.players.alive.map((p) => p.toString()).join(' ')

    if (this.phase === Phase.Day) {
      await this.announce(dedent(`
        ${playerReminders}

        The day phase will end in 1 hour from now. All accusations made prior to this point are now locked in place. If you have not made an accusation, you can still make one, but you will be unable to withdraw it or change it afterwards.
      `))
      this.allowVoteChange = false
      return
    }

    if (this.phase === Phase.Night) {
      await this.announce(dedent(`
        ${playerReminders}

        The night phase will end in 1 hour from now. If you have a night action and have not confirmed it, you will forfiet your action when the night ends.
      `))
      return
    }

    if (this.phase === Phase.Waiting) {
      await this.announce('The game will begin in 1 hour. If you have not already joined, and wish to, you must enter `/awoo join` before the game starts to join.')
    }
  }

  /* Sync Methods */
  /**
   * Find all players that match a particular substring.
   * @param name The substring to match with.
   */
  public findPlayers(name: string): Player[] {
    const players: Player[] = []

    // Do not attempt to search with an empty string.
    if (name === '') {
      return players
    }

    // Make our substring case-insensitive.
    const substring = name.toLowerCase()

    // Find all players that include the substring in their display name or tag.
    this.playerMap.forEach((player) => {
      // More case-insensitive setup.
      const tag = player.tag.toLowerCase()
      const displayName = player.name.toLowerCase()

      if (tag.includes(substring) || displayName.includes(substring)) {
        players.push(player)
      }
    })

    return players
  }
  /**
   * Attempt to find a player by a particular id string.
   * @param id The id string of the player being selected.
   */
  public getPlayer(id: string): Player | undefined {
    return this.playerMap.get(id)
  }
  /**
   * Print a human readable string that represents this game.
   */
  public toString(): string {
    return `${this.channel.guild.name} #${this.channel.name}`
  }
  /**
   * Cancel the next scheduled game and mark it undefined.
   */
  private clearSchedules(): void {
    if (this.schedule) {
      this.schedule.cancelNext()
      this.schedule = undefined
    }
    if (this.reminder) {
      this.reminder.cancelNext()
      this.reminder = undefined
    }
  }
  /**
   * Randomly assign roles to every player.
   */
  private randomizeRoles(): void {
    // Shuffle our player list.
    const players = Shuffle(this.players.all)
    players[0].role = new Roles.Seer(players[0])

    // Index variable for use later.
    let i = 1

    // Generate our werewolves.
    const werewolfCount = Math.floor(players.length / 4)
    for (; i <= werewolfCount; i += 1) {
      players[i].role = new Roles.Werewolf(players[i])
    }

    // No Tanner
    if (players.length >= 8) {
      players[i].role = new Roles.Mayor(players[i]); i++;
      players[i].role = new Roles.Bodyguard(players[i]); i++;
      players[i].role = new Roles.Lycan(players[i]); i++;
    }

    // New Roles
    if (players.length >= 12) {
      players[i].role = new Roles.Witch(players[i]); i++;
      players[i].role = new Roles.Sorceress(players[i]); i++;
      players[i].role = new Roles.Prince(players[i]); i++;
      players[i].role = new Roles.Hunter(players[i]); i++;
    }

    // Masons
    if (players.length >= 16) {
      for (let j = 0; j < werewolfCount - 2; j += 1) {
        players[i + j].role = new Roles.Mason(players[i + j]);
      }
    }
  }

  /* Role Logic */
  private werewolfNightAction(): Player | undefined {
    // Go through each player and tally up the votes.
    const votes = new Map<Player, number>()

    // Increment for each target made.
    this.players.alive.forEach((player) => {
      // Only count players who made an accusation.
      if (player.role instanceof Roles.Werewolf && player.role.target) {
        const count = votes.get(player.role.target) || 0

        // Count the votes.
        votes.set(player.role.target, count + 1)
      }
    })

    // Convert to an array and sort by number of votes.
    const sorted = [...votes.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([player, count]) => ({ player, count }))

    // Return the player with the most votes (or only votes).
    if (sorted.length === 1 || (sorted.length > 1 && sorted[0].count > sorted[1].count)) {
      return sorted[0].player
    }

    return undefined
  }
  private witchNightAction(): boolean {
    let usedSave = false

    this.players.alive.forEach((player) => {
      // Kill the player targeted by the witch.
      if (player.role instanceof Roles.Witch && player.role.target) {
        if (!player.role.usedKillPotion) {
          player.role.target.eliminate()
          // eslint-disable-next-line no-param-reassign
          player.role.usedKillPotion = true
          this.announce(Embed.witchElim(player.role.target))
        }

        if (!player.role.usedSavePotion) {
          usedSave = true
          // eslint-disable-next-line no-param-reassign
          player.role.usedSavePotion = true
          player.send('You have prevented a player from dying tonight.')
        }
      }
    })

    return usedSave
  }
  private async seerNightAction(): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const seer of this.players.role[Roles.Seer.name].all) {
      const seerRole = seer.role as Roles.Seer

      // Only process if target specified.
      if (seerRole.target) {
        // Do not reveal the inspected if the seer did not survive.
        if (seer.alive) {
          seer.send(`You have learned that ${seerRole.target.name} is a ${seerRole.target.role.appearance}.`);
          seerRole.inspected.set(seerRole.target.id, seerRole.target);
        } else {
          seer.send(`You have met an unfortunate end before you could learn about ${seerRole.target.name}.`);
        }
      }

      // Clear nightly actions.
      seerRole.resetActionState();
    }
  }
  private async sorceressNightAction(): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const sorceress of this.players.role[Roles.Sorceress.name].all) {
      const sorceressRole = sorceress.role as Roles.Sorceress

      // Only process if target specified.
      if (sorceressRole.target) {
        // Do not reveal the inspected if the seer did not survive.
        if (sorceress.alive) {
          sorceress.send(`You have learned that ${sorceressRole.target.name} is ${sorceressRole.target.role instanceof Roles.Seer ? '' : 'not'} a Seer.`);
          sorceressRole.inspected.set(sorceressRole.target.id, sorceressRole.target);
        } else {
          sorceress.send(`You have met an unfortunate end before you could learn about ${sorceressRole.target.name}.`);
        }
      }

      // Clear nightly actions.
      sorceressRole.resetActionState();
    }
  }

  /* Properties */
  get id(): string {
    return this.channel.id
  }
  get playerCount(): number {
    return this.playerMap.size
  }
  get scheduleTime(): Moment.Moment | undefined {
    if (this.schedule) {
      const scheduledTime = this.schedule.nextInvocation()

      return Moment(0)
        .year(scheduledTime.getFullYear())
        .month(scheduledTime.getMonth())
        .day(scheduledTime.getDay())
        .hour(scheduledTime.getHours())
        .minutes(scheduledTime.getMinutes())
        .second(scheduledTime.getSeconds())
    }

    return undefined
  }
  get players(): Players {
    const all: Player[] = []
    const alive: Player[] = []
    const eliminated: Player[] = []
    const role: { [key: string]: PlayerArray } = {}

    this.playerMap.forEach((player) => {
      const r = player.role.name

      // If we don't have an object for this role, create one.
      if (role[r] === undefined) {
        role[r] = { all: [], alive: [], eliminated: [] }
      }

      // All players get added to the map regardless of their state.
      all.push(player)
      role[r].all.push(player)

      // Separate the dead from the alive.
      if (player.alive) {
        alive.push(player)
        role[r].alive.push(player)
      } else {
        eliminated.push(player)
        role[r].eliminated.push(player)
      }
    })

    return { all, alive, eliminated, role }
  }
}
