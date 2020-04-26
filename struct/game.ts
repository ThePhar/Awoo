import Schedule from 'node-schedule';
import * as Discord from 'discord.js';
import * as Time from '../util/date';
import * as Roles from '../role';
import * as Embed from '../template/game';
import Phase from '../enum/phase';
import Player from './player';
import Manager from './manager';
import shuffle from '../util/shuffle';

const MINIMUM_PLAYERS = 6;

export default class Game {
  readonly channel: Discord.TextChannel;
  readonly manager: Manager;

  schedule?: Schedule.Job;
  lobbyMessage: Discord.Message;
  players = new Map<string, Player>();
  phase: Phase = Phase.Waiting;
  day = 0;

  static async createGame(channel: Discord.TextChannel, manager: Manager): Promise<Game> {
    const message = await channel.send(Embed.lobby());
    return new Game(channel, manager, message);
  }

  private constructor(channel: Discord.TextChannel, manager: Manager, lobbyMessage: Discord.Message) {
    this.channel = channel;
    this.manager = manager;
    this.lobbyMessage = lobbyMessage;
  }

  toString(): string {
    return `${this.channel.guild.name} ${this.channel.name}`;
  }

  /**
   * Send a message to the channel associated with this game.
   * @param content The message to send.
   */
  async announce(content: string | Discord.MessageEmbed): Promise<Discord.Message> {
    return this.channel.send(content);
  }

  /**
   * Assign everyone's role, send the role, and start the first night.
   */
  initializeGame(): void {
    this.assignRoles();

    // Mute all non-players.
    this.channel.updateOverwrite(this.channel.guild.roles.everyone, { SEND_MESSAGES: false });

    // Send everyone their role.
    this.players.forEach((player) => {
      this.channel.updateOverwrite(player.member, { SEND_MESSAGES: true });
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
        this.announce('NO ELIMS'); // TODO: Create embed
      }
    }

    // Check for win conditions and short circuit if a win-condition is met.
    if (this.winCondition()) {
      this.handleWin();
      return;
    }

    // Process inspections.
    this.playersArray.all.forEach((player) => {
      this.processSeerInspection(player);

      // Reset accusations.
      player.clearAccusation();
    });

    const nextNight = Time.getNextNight();

    this.schedule = Schedule.scheduleJob(nextNight.toDate(), this.startNightPhase.bind(this));
    this.announce(Embed.day(this));
  }
  /**
   * Changes the state to start the night phase.
   */
  startNightPhase(): void {
    this.day += 1;
    this.phase = Phase.Night;

    if (this.day !== 1) {
      // Eliminate the player with the most votes.
      this.processLynchElimination();
    }

    // Check for win conditions and short circuit if a win-condition is met.
    if (this.winCondition()) {
      this.handleWin();
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

    this.schedule = Schedule.scheduleJob(nextDay.toDate(), this.startDayPhase.bind(this));
    this.announce(Embed.night(this));
  }

  /**
   * Adds a player to this game if they don't already exist.
   * @param member The Discord member to associate with the new player.
   */
  addPlayer(member: Discord.GuildMember): void {
    const player = this.players.get(member.id);

    // Player already exists! Abort!
    if (player) {
      this.announce(`${member}, you are already a player in this game!`);
      return;
    }
    // If we are outside the lobby phase, do not allow joins.
    if (this.phase !== Phase.Waiting) {
      this.announce(`Sorry ${member}, but you cannot join a game in progress.`);
      return;
    }

    // Create our player.
    member.send(`You have joined the next game in ${this}!`)
      .then(() => {
        this.players.set(member.id, new Player(member, this));
        this.lobbyMessage.edit(Embed.lobby(this));
        this.announce(`${member} has signed up for the next game.`);

        // Schedule the game to begin if we surpassed the minimum threshold of players.
        if (this.totalPlayers >= MINIMUM_PLAYERS && !this.schedule) {
          this.schedule = Schedule.scheduleJob(Time.getNextNight().toDate(), () => this.initializeGame());
          this.announce('We have enough players to begin the next game. Scheduling to start next night.');
        }
      })
      .catch(() => {
        this.announce(`${member}, you must allow DMs from users in this server to join this game.`);
      });
  }
  /**
   * Remove a player from this game if they are already signed up.
   * @param member The Discord member associated with the player.
   */
  removePlayer(member: Discord.GuildMember): void {
    const player = this.players.get(member.id);

    if (player) {
      this.players.delete(member.id);
      this.lobbyMessage.edit(Embed.lobby(this));
      this.announce(`${member} is no longer signed up for the next game.`);

      // Unschedule the game to begin if we went under the threshold again.
      if (this.players.size < MINIMUM_PLAYERS && this.schedule) {
        this.clearSchedule();
        this.announce("Oh no! Now we don't have enough players. Canceling start until more players join.");
      }

      return;
    }

    // Player did not exist.
    this.announce(`${member}, you were already not signed up.`);
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
      if (
        player.member.displayName.includes(tag.toLowerCase())
        || player.tag.includes(tag.toLowerCase())
      ) {
        playerArray.push(player);
      }
    });

    return playerArray;
  }
  /**
   * Randomly assign role to every player.
   */
  assignRoles(): void {
    const shuffled = shuffle(this.playersArray.all);

    shuffled[0].role = new Roles.Seer(shuffled[0]);
    shuffled[1].role = new Roles.Werewolf(shuffled[1]);
    shuffled[4].role = new Roles.Mayor(shuffled[4]);

    // Chance for role?
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
      this.announce(Embed.werewolfWin(this));
      return true;
    }

    if (wCount === 0) {
      // Villagers win.
      this.announce(Embed.villagerWin(this));
      return true;
    }

    return false;
  }
  handleWin(): void {
    this.clearSchedule();
    this.manager.games.delete(this.id);

    // Unmute all non-players.
    this.channel.updateOverwrite(this.channel.guild.roles.everyone, { SEND_MESSAGES: null });

    // Unmute all players.
    this.players.forEach((player) => {
      this.channel.updateOverwrite(player.member, { SEND_MESSAGES: null });
    });
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
      this.announce(Embed.lynch(this, sorted[0][0], sorted)); // TODO: Create embed
      return;
    }
    if (sorted.length > 1) {
      if (sorted[0][1] > sorted[1][1]) {
        sorted[0][0].eliminate();
        this.announce(Embed.lynch(this, sorted[0][0], sorted)); // TODO: Create embed
        return;
      }
    }

    // If we got here, we were unable to lynch a single player.
    this.announce(Embed.noLynch(sorted, this)); // TODO: Create embed
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
      this.announce(Embed.werewolf(sorted[0][0])); // TODO: Create embed
      return true;
    }
    if (sorted.length > 1) {
      if (sorted[0][1] > sorted[1][1]) {
        sorted[0][0].eliminate();
        this.announce(Embed.werewolf(sorted[0][0])); // TODO: Create embed
        return true;
      }
    }

    this.announce(Embed.noNightElim());
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
      player.role.inspected.set(player.role.target.id, player.role.target);
    } else {
      player.send(`You have met an unfortunate end before you could learn about ${player.role.target}.`);
    }

    // Clear nightly actions.
    player.role.resetActionState();
  }

  get id(): string {
    return this.channel.guild.id;
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
