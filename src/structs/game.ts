import * as Discord from "discord.js";
import GameState from "../interfaces/game-state";
import Phase from "./phase";
import Player from "./player";

export default class Game {
    readonly players: Player[] = [];

    private readonly _notificationChannel: Discord.TextChannel;

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

    get send():   Function {
        return this._notificationChannel.send;
    }
    get id():     string {
        return this._notificationChannel.guild.id;
    }
    get active(): boolean {
        return this._active;
    }
    get phase():  Phase {
        return this._phase;
    }
    get day():    number {
        return this._day;
    }
}
