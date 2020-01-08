import { GuildMember } from "discord.js";
import { GameStore } from "../store/game";
import Role from "../interfaces/role";
import NightActiveRole from "../interfaces/night-active-role";
import Villager from "../roles/villager";

type RoleType = Role | NightActiveRole;

export default class Player {
    user: GuildMember;
    role: RoleType;
    game: GameStore;
    isAlive = true;
    accusing: Player | null;
    target: Player | null;

    constructor(user: GuildMember, game: GameStore, role?: Role) {
        this.user = user;
        this.role = role || new Villager(this);
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
