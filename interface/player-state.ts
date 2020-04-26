import Player from "../struct/player";

export default interface PlayerState {
    alive:    boolean;
    accusing: Player | null;
}
