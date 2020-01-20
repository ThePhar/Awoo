import * as Discord from "discord.js";

import PlayerState  from "../interfaces/player-state";
import Role         from "../interfaces/role";
import Game         from "./game";
import Villager     from "../roles/villager";

export default class Player {
    private readonly _member: Discord.GuildMember;
    private readonly _role:   Role;
    private readonly _game:   Game;

    private readonly _alive:    boolean       = true;
    private readonly _accusing: Player | null = null;

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
    get accusing(): Player | null {
        return this._accusing;
    }
}
