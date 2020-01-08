import { User } from "discord.js";
import { GameStore } from "../../store/game";
import Player from "../../structs/player";

export function createStubPlayer(id?: string): Player {
    return new Player({ id } as User, {} as GameStore);
}
