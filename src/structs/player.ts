import * as Discord from "discord.js";

import PlayerState from "../interfaces/player-state";
import Role        from "../interfaces/role";
import Villager    from "../roles/villager";
import Game        from "./game";
import Phase       from "./phase";

import AccusationTemplate from "../templates/accusation-templates";

export default class Player {
    private readonly _member: Discord.GuildMember;
    private readonly _role:   Role;
    private readonly _game:   Game;

    private _alive                   = true;
    private _accusing: Player | null = null;

    constructor(member: Discord.GuildMember, game: Game, state?: PlayerState) {
        this._member = member;
        this._role   = new Villager(this);
        this._game   = game;

        if (state) {
            this._alive    = state.alive;
            this._accusing = state.accusing;
        }
    }

    /**
     * Returns a player name string in Discord's mention format.
     */
    toString(): string {
        return `<@!${this._member.id}>`;
    }

    /**
     * Accuse a player of being a werewolf and bring them closer to being lynched. Does not set accusation if the
     * player or game state does not allow it.
     * @param accusing The player to vote to be lynched.
     * @return Returns true if successfully set accusing flag; returns false otherwise.
     */
    accuse(accusing: Player): boolean {
        // Game is not active.
        if (!this.game.active) {
            this.send(AccusationTemplate.inactiveLynch());
            return false;
        }
        // Player is dead.
        if (!this.alive) {
            this.send(AccusationTemplate.ghostLynch());
            return false;
        }
        // Not the Day Phase
        if (this.game.phase !== Phase.Day) {
            this.send(AccusationTemplate.nonDayLynch());
            return false;
        }
        // Player is targeting themselves.
        if (accusing.id === this.id) {
            this.send(AccusationTemplate.selfLynch());
            return false;
        }
        // Accusing player is dead.
        if (!accusing.alive) {
            this.send(AccusationTemplate.deadLynch());
            return false;
        }

        // All else is good!
        this._accusing = accusing;
        this.send(AccusationTemplate.success(accusing));
        return true;
    }

    get send():     Function {
        return this._member.send;
    }
    get id():       string {
        return this._member.id;
    }
    get tag():      string {
        return this._member.user.tag;
    }
    get name():     string {
        return this._member.displayName;
    }
    get role():     Role {
        return this._role;
    }
    get game():     Game {
        return this._game;
    }
    get alive():    boolean {
        return this._alive;
    }
    set alive(value: boolean) {
        this._alive = value;
    }
    get accusing(): Player | null {
        return this._accusing;
    }
    set accusing(value: Player | null) {
        this._accusing = value;
    }
}
