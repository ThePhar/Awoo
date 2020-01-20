import * as Discord from "discord.js";

import GameState    from "../interfaces/game-state";
import Phase        from "./phase";
import Player       from "./player";

export default class Game {
    private readonly _notificationChannel: Discord.TextChannel;

    private readonly _players         = new Map<string, Player>();
    private readonly _active: boolean = false;
    private readonly _phase:  Phase   = Phase.Waiting;
    private readonly _day:    number  = 0;

    constructor(channel: Discord.TextChannel, state?: GameState) {
        this._notificationChannel = channel;

        // Predetermined values.
        if (state) {
            this._active = state.active;
            this._phase = state.phase;
            this._day = state.day;
        }
    }

    /**
     * Create a player and add it to the game's players map. If a player already exists, does nothing and returns.
     * @param member The guild member object from Discord.
     * @return The newly instantiated player object if not already exists. Otherwise, undefined.
     */
    addPlayer(member: Discord.GuildMember): Player | undefined {
        if (this._players.get(member.id)) {
            return;
        }

        const player = new Player(member, this);

        this._players.set(player.id, player);
        return player;
    }

    /**
     * Get the player from the game's players map if exists. If no player exists, returns undefined.
     * @param id The id of the player to find. Should match the id of the Discord user.
     * @return The existing player object if already exists. Otherwise, undefined.
     */
    getPlayer(id: string): Player | undefined {
        return this._players.get(id);
    }

    /**
     * Remove and return the player from the game's players map if exists. If no player exists, returns undefined.
     * @param id The id of the player to find. Should match the id of the Discord user.
     * @return The removed player object if already exists. Otherwise, undefined.
     */
    removePlayer(id: string): Player | undefined {
        const player = this._players.get(id);

        if (player) {
            this._players.delete(id);
            return player;
        }
    }

    get send():         Function {
        return this._notificationChannel.send;
    }
    get id():           string {
        return this._notificationChannel.guild.id;
    }
    get totalPlayers(): number {
        return this._players.size;
    }
    get active():       boolean {
        return this._active;
    }
    get phase():        Phase {
        return this._phase;
    }
    get day():          number {
        return this._day;
    }
}
