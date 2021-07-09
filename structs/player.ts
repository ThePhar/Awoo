import dedent from "dedent";
import * as D from "discord.js";
import * as Embed from "../template/game";
import * as Roles from "../role";
import Game from "./game";
import Phase from "../enum/phase";
import Role from "../interface/role";
import AccusationTemplate from "../template/accusation-templates";
import { Hunter } from "../role";

export default class Player {
    public readonly member: D.GuildMember;
    public readonly game: Game;

    public accusing?: Player;
    public alive = true;
    public role: Role;

    public constructor(member: D.GuildMember, game: Game) {
        this.member = member;
        this.role = new Roles.Villager(this);
        this.game = game;
    }

    /**
     * Returns a player name string in Discord's mention format.
     */
    public toString(): string {
        return `<@!${this.member.id}>`;
    }
    /**
     * Returns text version of player name.
     */
    public toTextString(): string {
        return `${this.name} **aka** \`${this.tag}\``;
    }

    /**
     * Send a message to this user privately.
     * @param content The message to send.
     */
    public send(content: string | D.MessageEmbed): Promise<D.Message> {
        return this.member.send(content) as Promise<D.Message>;
    }

    /**
     * Accuse a player of being a werewolf and bring them closer to being lynched. Does not set accusation if the
     * player or game state does not allow it.
     * @param accusing The player name substring to vote to be lynched.
     * @return Returns true if successfully set accusing flag returns false otherwise.
     */
    public async accuse(accusing: string): Promise<boolean> {
        // Player is dead.
        if (!this.alive) {
            await this.game.announce(AccusationTemplate.ghostLynch(this));
            return false;
        }

        // Not the Day Phase
        if (this.game.phase !== Phase.Day) {
            await this.game.announce(AccusationTemplate.nonDayLynch(this));
            return false;
        }

        // Find the player associated with this string.
        let accused: Player[];

        // Check if it's a Discord Mention string.
        const regex = /<@!?([0-9]+)>/;
        if (regex.test(accusing)) {
            const id = (regex.exec(accusing) as RegExpExecArray)[1]; // Get the id from the mention string.
            const player = this.game.getPlayer(id);

            // Only use this if player is not undefined.
            accused = player ? [player] : [];
        } else {
            accused = this.game.findPlayers(accusing);
        }

        // No players found.
        if (accused.length === 0) {
            await this.game.announce(`${this}, I was unable to find any player under the name \`${accusing}\`.`);
            return false;
        }

        // Multiple players found.
        if (accused.length > 1) {
            await this.game.announce(
                dedent(`
        ${this}, I found multiple players under that name. Can you try again and be more specific?
        
        Possible Targets:
        \`\`\`
        ${accused.map((player) => `${player.toTextString()}`).join("\n")}
        \`\`\`
      `),
            );
            return false;
        }

        const [accusedPlayer] = accused;

        // Player is targeting themselves.
        if (accusedPlayer.id === this.id) {
            await this.game.announce(AccusationTemplate.selfLynch(this));
            return false;
        }

        // Accusing player is dead.
        if (!accusedPlayer.alive) {
            await this.game.announce(AccusationTemplate.deadLynch(this));
            return false;
        }

        if (this.accusing) {
            // If trying to target the same player again.
            if (this.accusing.id === accusedPlayer.id) {
                await this.game.announce(`${this}, you've already voted to lynch ${this.accusing.toTextString()}.`);
                return false;
            }

            // Don't allow vote change if not allowed to change.
            if (!this.game.allowVoteChange) {
                await this.game.announce(
                    `${this}, you cannot change your vote at this stage of the game. All votes are final.`,
                );
                return false;
            }
        }

        // All else is good!
        this.accusing = accusedPlayer;
        await this.game.announce(AccusationTemplate.success(this, accusedPlayer));
        return true;
    }

    /**
     * Clear any accusations this player has made.
     */
    clearAccusation(): void {
        this.accusing = undefined;
    }
    /**
     * Attempt to clear an accusation that was fired by a user.
     */
    public async clearAccusationUserDriven(): Promise<void> {
        // Player is dead.
        if (!this.alive) {
            await this.game.announce(`${this}, you are dead.`);
            return;
        }

        // Disallow outside of day phase.
        if (this.game.phase !== Phase.Day) {
            await this.game.announce(`${this}, you cannot clear an accusation outside of the Day Phase.`);
            return;
        }

        // Don't clear if we weren't already targeting someone.
        if (!this.accusing) {
            await this.game.announce(`${this}, you aren't already targeting a player.`);
            return;
        }

        // Don't allow vote change if not allowed to change.
        if (!this.game.allowVoteChange) {
            await this.game.announce(
                `${this}, you cannot clear your vote at this stage of the game. All votes are final.`,
            );
            return;
        }

        await this.game.announce(`${this}, has withdrawn their accusation against ${this.accusing}.`);
        this.clearAccusation();
    }

    /**
     * Eliminate this player from the game.
     */
    eliminate(): void {
        // Handle hunter logic.
        if (this.role instanceof Hunter) {
            if (this.role.target) {
                this.role.target.eliminate();
                this.game.announce(Embed.hunterElim(this));
            }

            if (this.role.prompt) {
                this.role.prompt.destroy();
            }
        }

        this.alive = false;
        this.game.channel.updateOverwrite(this.member, { SEND_MESSAGES: false });
    }

    get id(): string {
        return this.member.id;
    }
    get tag(): string {
        return this.member.user.tag;
    }
    get name(): string {
        return this.member.displayName;
    }
}
