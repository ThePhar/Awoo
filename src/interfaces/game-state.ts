import Phase from "../structs/phase";

export default interface GameState {
    active: boolean;
    phase:  Phase;
    day:    number;
}
