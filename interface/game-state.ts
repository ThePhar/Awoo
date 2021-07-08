import Phase from "../enum/phase";

export default interface GameState {
    active: boolean;
    phase: Phase;
    day: number;
}
