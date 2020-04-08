import * as Discord from 'discord.js';
import * as PlayerSelector from '../selectors/player-selector';
import Player from './player';
import Phase from './phase';

export default class Game {
  private channel: Discord.TextChannel;

  public players = new Map<string, Player>();
  public accusations = new Map<string, Player>();
  public phase = Phase.Waiting;
  public day = 0;

  constructor(channel: Discord.TextChannel) {
    this.channel = channel;
  }

  /**
   * Send an announcement message to the channel designated for this game.
   * @param content The message to send.
   */
  announce(content: unknown): Promise<Discord.Message> {
    return this.channel.send(content);
  }

  /**
   * Adds and returns a player to this game instance; returns the current player if already exists.
   * @param member The Discord member object to associate with a new player.
   */
  addPlayer(member: Discord.GuildMember): Player {
    // Ensure this player doesn't already exist.
    let player = this.getPlayer(member.id);
    if (player) { return player; }

    player = new Player(member);
    this.players.set(member.id, player);

    return player;
  }

  /**
   * Removes and returns the player associated with a particular Discord Member Id; returns
   * undefined if they don't exist.
   * @param id The Discord Member id to remove.
   */
  removePlayer(id: string): Player | undefined {
    const player = this.getPlayer(id);

    // Remove this player from this game if they exist.
    if (player) {
      this.players.delete(id);
      return player;
    }

    // If player doesn't exist.
    return undefined;
  }

  /**
   * Attempt to get the player object associated with this game.
   * @param id The Discord member id for this player.
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  /**
   * Attempt to find all players that match a specified tag substring.
   * @param tag
   * @returns Object including if there's an error and a list of players found.
   */
  findPlayers(tag: string): { error: string | null, players: Player[] } {
    const playerArray: Player[] = [];
    const lTag = tag.toLowerCase();

    // Do not continue if no tag was supplied to this function.
    if (lTag === '') {
      return { error: 'No arguments', players: [] };
    }

    // Find all players in this game that match the given tag.
    this.players.forEach((player) => {
      if (player.tag.toLowerCase().includes(lTag)) {
        playerArray.push(player);
      }
    });

    return { error: null, players: playerArray };
  }

  /**
   * Log and announce lynch votes for lynching elimination logic.
   * @param accuser The player who is voting to lynch.
   * @param accused The player being accused.
   */
  accuse(accuser: Player, accused: Player): { error: string | null } {
    // Ensure the accuser and accused are alive.
    if (!accuser.alive) { return { error: 'Accuser is eliminated' }; }
    if (!accused.alive) { return { error: 'Accused is eliminated' }; }

    const currentAccusation = this.accusations.get(accuser.id);

    // Trying to accuse the same player.
    if (currentAccusation === accused) {
      return { error: 'Already accusing accused player' };
    }

    // Set and announce accusation state change.
    this.accusations.set(accuser.id, accused);
    if (currentAccusation) {
      this.announce(`${accuser} has changed their mind and voted to lynch ${accused}!`);
    } else {
      this.announce(`${accuser} has voted to lynch ${accused}!`);
    }

    // Everything is good!
    return { error: null };
  }

  /**
   * Find the player's accusation and remove it from the accusations map.
   * @param player The player who made the accusation to be cleared.
   */
  clearAccusation(player: Player): void {
    const deleted = this.accusations.delete(player.id);

    if (deleted) {
      this.announce(`${player} is no longer voting to lynch anyone.`);
    }
  }

  /**
   * Clear all accusations and create a new Map for storing living player's accusations.
   */
  resetAccusations(): void {
    // Clear current accusations.
    this.accusations = new Map<string, Player>();
  }

  /**
   * Change the phase to day and process any night eliminations and actions.
   */
  startDayPhase(): void {
    // Initialize the phase values.
    this.phase = Phase.Day;

    if (!this.hasWinConditionBeenMet()) {
      // TODO: Change to Embed instead of hardcoded string.
      this.announce('Day Phase Start');
    }
  }

  /**
   * Change the phase to night and process any lynch eliminations and day actions.
   */
  startNightPhase(): void {
    // Initialize the phase values.
    this.day += 1;
    this.phase = Phase.Night;

    if (!this.hasWinConditionBeenMet()) {
      // TODO: Process accusations and lynching.
      this.resetAccusations();

      // TODO: Change to Embed instead of hardcoded string.
      this.announce('Night Phase Start');
    }
  }

  /**
   * Checks if a win condition has been met and prints an announcement out.
   * @returns True if a win condition is met, false otherwise.
   */
  hasWinConditionBeenMet(): boolean {
    const livingVillagers = PlayerSelector.getAllLivingVillagers(this.players);
    const livingWerewolves = PlayerSelector.getAllLivingWerewolves(this.players);

    // Check Werewolf Win Condition
    if (livingWerewolves.length >= livingVillagers.length) {
      // TODO: Change to Embed.
      this.announce('Werewolves win!');
      return true;
    }

    // Check Villager Win Condition
    if (livingWerewolves.length === 0) {
      // TODO: Change to Embed.
      this.announce('Villagers win!');
      return true;
    }

    return false;
  }
}
