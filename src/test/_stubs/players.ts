import { Game, GuildMember } from "discord.js";
import { GameStore } from "../../store/game";
import Player from "../../structs/player";
import Werewolf from "../../roles/werewolf";
import { createStubGuildMember } from "./clients";

export function createStubPlayer(id?: string): Player {
    return new Player(createStubGuildMember(id), {} as GameStore);
}
export function createStubPlayerWithWerewolves(id?: string): Player {
    const player = createStubPlayer("7001");
    player.role = new Werewolf(player);

    const player2 = createStubPlayer(id);
    player2.game.getState = (): object => ({ players: [player] });

    return player2;
}
