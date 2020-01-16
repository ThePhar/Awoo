import Game from "../structs/game";
import Role from "./role";

export default interface PlayerData {
    name: string;
    id: string;
    game: Game;

    send: Function;

    role?: Role;
    alive?: boolean;
}
