import dedent from 'dedent';
import Schedule from 'node-schedule';
import * as Discord from 'discord.js';
import * as Time from '../util/date';
import * as Logger from '../util/logging';
import * as Roles from '../roles';
import Phase from './phase';
import Player from './player';
import Manager from '../manager';
import shuffle from '../util/shuffle';

const MINIMUM_PLAYERS = 6;

export default class Game {
  readonly channel: Discord.TextChannel;

  schedule?: Schedule.Job;
  players = new Map<string, Player>();
  phase: Phase = Phase.Waiting;
  day = 0;

  constructor(channel: Discord.TextChannel) {
    this.channel = channel;

    Logger.log(dedent(`
      Generating a new game with default state.
        Guild:   ${this.channel.guild.id}: ${this.channel.guild.name}
        Channel: ${this.channel.id}: ${this.channel.name}
        Phase:   ${this.phase}
        Day:     ${this.day}
    `));
  }

  toString(): string {
    return `${this.channel.guild.name} ${this.channel.name}`;
  }

  /**
   * Send a message to the channel associated with this game.
   * @param content The message to send.
   */
  send(content: unknown): void {
    this.channel.send(content)
      .catch((err) => {
        Logger.error(dedent(`
          Error attempting to send a message to the channel.
            Guild: ${this.guild.name}
            Channel: ${this.channel.name}
            Message: ${content}
            Error: ${err} 
        `));
      });
  }

  /**
   * Assign everyone's roles, send the roles, and start the first night.
   */
  initializeGame(): void {
    this.assignRoles();

    // Send everyone their roles.
    this.players.forEach((player) => {
      player.role.startRole();
    });
    this.startNightPhase();
  }
  /**
   * Changes the state to start the day phase.
   */
  startDayPhase(): void {
    this.phase = Phase.Day;

    // Process night actions.
    if (this.day !== 1) {
      const elim1 = this.processWerewolfElimination();

      // If no eliminations were made, announce everyone survived.
      if (!elim1) {
        this.send('NO ELIMS'); // TODO: Create embed
      }
    }

    // Check for win conditions and short circuit if a win-condition is met.
    if (this.winCondition()) {
      this.clearSchedule();
      Manager.games.delete(this.id);
      return;
    }

    // Process inspections.
    this.playersArray.all.forEach((player) => {
      this.processSeerInspection(player);

      // Reset accusations.
      player.clearAccusation();
    });

    const nextNight = Time.getNextNight();

    this.send('DAY PHASE'); // TODO: Create embed
    this.schedule = Schedule.scheduleJob(nextNight.toDate(), () => this.startNightPhase());
  }
  /**
   * Changes the state to start the night phase.
   */
  startNightPhase(): void {
    this.day += 1;
    this.phase = Phase.Night;

    // Eliminate the player with the most votes.
    this.processLynchElimination();

    // Check for win conditions and short circuit if a win-condition is met.
    if (this.winCondition()) {
      this.clearSchedule();
      Manager.games.delete(this.id);
      return;
    }

    // Clear all accusations and send night action reminders.
    this.players.forEach((player) => {
      player.clearAccusation();

      if (player.alive) {
        player.role.startAction();
      }
    });

    const nextDay = Time.getNextMorning();

    this.send('NIGHT PHASE'); // TODO: Create embed
    this.schedule = Schedule.scheduleJob(nextDay.toDate(), () => this.startDayPhase());
  }

  /**
   * Adds a player to this game if they don't already exist.
   * @param member The Discord member to associate with the new player.
   */
  addPlayer(member: Discord.GuildMember): void {
    const player = this.players.get(member.id);

    // Player already exists! Abort!
    if (player) {
      Logger.warn(dedent(`
        Player already exists in this game.
          Guild:   ${this.channel.guild.id}: ${this.channel.guild.name}
          Channel: ${this.channel.id}: ${this.channel.name}
          Player:  ${player.id}: ${player.name} (${player.tag})
      `));

      return;
    }
    // If we are outside the lobby phase, do not allow joins.
    if (this.phase !== Phase.Waiting) {
      this.send(`Sorry ${member}, but you cannot join a game in progress.`);
      return;
    }

    // Create our player.
    this.players.set(member.id, new Player(member, this));
    Logger.log(dedent(`
      A player joined game.
        Guild:   ${this.channel.guild.id}: ${this.channel.guild.name}
        Channel: ${this.channel.id}: ${this.channel.name}
        Player:  ${member.id}: ${member.displayName} (${member.user.tag})
    `));

    // Schedule the game to begin if we surpassed the minimum threshold of players.
    if (this.totalPlayers >= MINIMUM_PLAYERS && !this.schedule) {
      this.schedule = Schedule.scheduleJob(Time.getNextNight().toDate(), () => this.initializeGame());
      this.send('We have enough players to begin the next game. Scheduling to start next night.');

      Logger.log(dedent(`
        Player count has exceeded minimum threshold. Scheduling game start at next night.
          Guild:   ${this.channel.guild.id}: ${this.channel.guild.name}
          Channel: ${this.channel.id}: ${this.channel.name}
          Start:   ${Time.getNextNight().format()}
      `));
    }
  }
  /**
   * Remove a player from this game if they are already signed up.
   * @param member The Discord member associated with the player.
   */
  removePlayer(member: Discord.GuildMember): void {
    const player = this.players.get(member.id);

    if (player) {
      Logger.log(dedent(`
        Player left game.
          Guild:   ${this.channel.guild.id}: ${this.channel.guild.name}
          Channel: ${this.channel.id}: ${this.channel.name}
          Player:  ${player.id}: ${player.name} (${player.tag})
      `));
      this.players.delete(member.id);

      // Unschedule the game to begin if we went under the threshold again.
      if (this.players.size < MINIMUM_PLAYERS && this.schedule) {
        Logger.log(dedent(`
          Player count is lower than minimum threshold. Canceling game start until threshold reached.
            Guild:   ${this.channel.guild.id}: ${this.channel.guild.name}
            Channel: ${this.channel.id}: ${this.channel.name}
        `));

        this.clearSchedule();
        this.send("Oh no! Now we don't have enough players. Canceling start until more players join.");
      }
    }
  }
  /**
   * Find a player by a particular id.
   * @param id The id associated with a player.
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }
  /**
   * Find all players that match a particular tag string.
   * @param tag The tag substring to search by.
   */
  findPlayersByTag(tag: string): Player[] {
    const playerArray: Player[] = [];

    // Do not attempt to search with an empty string.
    if (tag === '') {
      return [];
    }

    // Find all players that include the substring.
    this.players.forEach((player) => {
      if (player.tag.toLowerCase().includes(tag.toLowerCase())) {
        playerArray.push(player);
      }
    });

    return playerArray;
  }
  /**
   * Randomly assign roles to every player.
   */
  assignRoles(): void {
    const shuffled = shuffle(this.playersArray.all);

    shuffled[0].role = new Roles.Seer(shuffled[0]);
    shuffled[1].role = new Roles.Werewolf(shuffled[1]);

    // Chance for roles?
    if (shuffled.length >= 9) {
      shuffled[8].role = new Roles.Werewolf(shuffled[8]);
    }
    if (shuffled.length >= 15) {
      shuffled[14].role = new Roles.Werewolf(shuffled[14]);
    }
    if (shuffled.length >= 21) {
      shuffled[20].role = new Roles.Werewolf(shuffled[20]);
    }
  }

  /**
   * Cancel the next scheduled game and mark it undefined.
   */
  clearSchedule(): void {
    if (this.schedule) {
      this.schedule.cancelNext();
      this.schedule = undefined;
    }
  }

  /**
   * Checks if a win condition has been met for any team in particular. Returns true if one is met.
   */
  winCondition(): boolean {
    const vCount = this.playersArray.aliveVillagers.length;
    const wCount = this.playersArray.aliveWerewolves.length;

    if (vCount === 0 || wCount >= vCount) {
      // Werewolves win.
      this.send('WEREWOLVES WIN'); // TODO: Create embed
      return true;
    }

    if (wCount === 0) {
      // Villagers win.
      this.send('VILLAGERS WIN'); // TODO: Create embed
      return true;
    }

    return false;
  }

  /**
   * Go through each player and process which player to lynch.
   */
  processLynchElimination(): void {
    // Go through each player and tally up the votes.
    const votes = new Map<Player, number>();

    // Start counting each player.
    this.players.forEach((player) => {
      if (player.accusing) {
        const value = votes.get(player.accusing);
        // If the player is a Mayor, count their vote twice.
        const increment = player.role instanceof Roles.Mayor ? 2 : 1;

        // Count the votes.
        if (value) {
          votes.set(player.accusing, value + increment);
        } else {
          votes.set(player.accusing, increment);
        }
      }
    });

    // Convert map to array and sort by number of votes.
    const sorted = [...votes.entries()].sort((a, b) => b[1] - a[1]);

    if (sorted.length === 1) {
      sorted[0][0].eliminate();
      this.send(`LYNCHED: ${sorted[0][0]}`); // TODO: Create embed
      return;
    }
    if (sorted.length > 1) {
      if (sorted[0][1] > sorted[1][1]) {
        sorted[0][0].eliminate();
        this.send(`LYNCHED: ${sorted[0][0]}`); // TODO: Create embed
        return;
      }
    }

    // If we got here, we were unable to lynch a single player.
    this.send('NO LYNCH'); // TODO: Create embed
  }

  /**
   * Count all werewolf targets and eliminate the player with the most werewolves targeting them.
   */
  processWerewolfElimination(): boolean {
    // Go through each player and tally up the votes.
    const votes = new Map<Player, number>();

    // Increment for each target made.
    this.playersArray.aliveWerewolves.forEach((werewolf) => {
      const role = werewolf.role as Roles.Werewolf;

      if (role.target) {
        const value = votes.get(role.target);

        if (value) {
          votes.set(role.target, value + 1);
        } else {
          votes.set(role.target, 1);
        }
      }
    });

    // Convert map to array and sort by number of votes.
    const sorted = [...votes.entries()].sort((a, b) => b[1] - a[1]);

    if (sorted.length === 1) {
      sorted[0][0].eliminate();
      this.send(`WEREWOLF ELIM: ${sorted[0][0]}`); // TODO: Create embed
      return true;
    }
    if (sorted.length > 1) {
      if (sorted[0][1] > sorted[1][1]) {
        sorted[0][0].eliminate();
        this.send(`WEREWOLF ELIM: ${sorted[0][0]}`); // TODO: Create embed
        return true;
      }
    }

    return false;
  }
  /**
   * Inspect a player if the seer survived the night.
   * @param player
   */
  processSeerInspection(player: Player): void {
    // Do not process for players who are not Seers.
    if (!(player.role instanceof Roles.Seer)) return;
    // Do not process if no target specified.
    if (!player.role.target) return;

    // Do not reveal the inspected if the seer did not survive.
    if (player.alive) {
      player.send(`You have learned that ${player.role.target} is a ${player.role.target.role.appearance}.`);
    } else {
      player.send(`You have met an unfortunate end before you could learn about ${player.role.target}.`);
    }

    // Clear nightly actions.
    player.role.resetActionState();
  }

  get id(): string {
    return this.channel.guild.id;
  }
  get guild(): Discord.Guild {
    return this.channel.guild;
  }
  get totalPlayers(): number {
    return this.players.size;
  }
  get playersArray(): Players {
    const all: Player[] = [];
    const alive: Player[] = [];
    const dead: Player[] = [];
    const aliveWerewolves: Player[] = [];
    const aliveVillagers: Player[] = [];

    this.players.forEach((player) => {
      all.push(player);

      if (player.alive) {
        alive.push(player);

        if (player.role instanceof Roles.Werewolf) {
          aliveWerewolves.push(player);
        } else {
          aliveVillagers.push(player);
        }
      } else {
        dead.push(player);
      }
    });

    return {
      all,
      dead,
      alive,
      aliveVillagers,
      aliveWerewolves,
    };
  }
}

type Players = {
  all: Player[];
  alive: Player[];
  dead: Player[];
  aliveWerewolves: Player[];
  aliveVillagers: Player[];
}
