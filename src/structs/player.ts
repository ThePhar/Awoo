import { GuildMember } from "discord.js";
import { GameStore } from "../store/game";
import Role from "../interfaces/role";
import NightActiveRole from "../interfaces/night-active-role";

type RoleNullableType = Role | NightActiveRole | null;

export default class Player {
    user: GuildMember;
    role: RoleNullableType;
    game: GameStore;
    isAlive = true;
    accusing: Player | null;
    target: Player | null;

    constructor(user: GuildMember, game: GameStore, role?: Role) {
        this.user = user;
        this.role = role || null;
        this.game = game;

        this.accusing = null;
        this.target = null;
    }

    toString(): string {
        return `${this.user} :: \`${this.name}\``;
    }

    get id(): string {
        return this.user.id;
    }
    get name(): string {
        return this.user.user.tag;
    }
}
