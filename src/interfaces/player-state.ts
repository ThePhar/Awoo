import Player from "../structs/player";

export default interface PlayerState {
    alive:    boolean;
    accusing: Player | null;
}
