import dedent from 'dedent';
import * as Discord from 'discord.js';
import * as Roles from '../roles';
import Role from '../interfaces/role';
import Game from './game';
import Phase from './phase';
import AccusationTemplate from '../templates/accusation-templates';

export default class Player {
  readonly member: Discord.GuildMember;
  readonly game: Game;

  role: Role;
  alive = true;
  accusing: Player | null = null;

  constructor(member: Discord.GuildMember, game: Game) {
    this.member = member;
    this.role = new Roles.Villager(this);
    this.game = game;
  }

  /**
   * Returns a player name string in Discord's mention format.
   */
  toString(): string {
    return `<@${this.member.id}>`;
  }

  /**
   * Send a message to this user privately.
   * @param content The message to send.
   */
  send(content: unknown): Promise<Discord.Message> {
    return this.member.send(content) as Promise<Discord.Message>;
  }

  /**
   * Accuse a player of being a werewolf and bring them closer to being lynched. Does not set accusation if the
   * player or game state does not allow it.
   * @param accusing The player to vote to be lynched.
   * @return Returns true if successfully set accusing flag; returns false otherwise.
   */
  accuse(accusing: string): boolean {
    // Player is dead.
    if (!this.alive) {
      this.game.send(AccusationTemplate.ghostLynch());
      return false;
    }

    // Find the player associated with this string.
    let accused: Player[] = [];

    // Check if it's a Discord Mention string.
    const regex = /<@!?([0-9]+)>/;
    if (regex.test(accusing)) {
      const id = (regex.exec(accusing) as RegExpExecArray)[1]; // Get the id from the mention string.
      const player = this.game.getPlayer(id);

      // Only use this if player is not undefined.
      accused = player ? [player] : [];
    } else {
      accused = this.game.findPlayersByTag(accusing);
    }

    // No players found.
    if (accused.length === 0) {
      this.game.send('I was unable to find any player under that name.');
      return false;
    }

    // Multiple players found.
    if (accused.length > 1) {
      this.game.send(dedent(`
        ${this}, I found multiple players under that name. Can you try again and be more specific?
        
        Possible Targets:
        \`\`\`
        ${accused.map((player) => `${player.name} (${player.tag})`).join('\n')}
        \`\`\`
      `));
      return false;
    }

    const [accusedPlayer] = accused;

    // Not the Day Phase
    if (this.game.phase !== Phase.Day) {
      this.game.send(AccusationTemplate.nonDayLynch());
      return false;
    }

    // Player is targeting themselves.
    if (accusedPlayer.id === this.id) {
      this.game.send(AccusationTemplate.selfLynch());
      return false;
    }

    // Accusing player is dead.
    if (!accusedPlayer.alive) {
      this.game.send(AccusationTemplate.deadLynch());
      return false;
    }

    // All else is good!
    this.accusing = accusedPlayer;
    this.game.send(AccusationTemplate.success(accusedPlayer));
    return true;
  }

  /**
   * Clear any accusations this player has made.
   */
  clearAccusation(): void {
    this.accusing = null;
  }
  /**
   * Eliminate this player from the game.
   */
  eliminate(): void {
    this.alive = false;
  }

  get id(): string {
    return this.member.id;
  }
  get user(): Discord.User {
    return this.member.user;
  }
  get tag(): string {
    return this.member.user.tag;
  }
  get name(): string {
    return this.member.displayName;
  }
}
