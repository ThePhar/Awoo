import { GameStore } from "../../store/game";

export function createStubGameStore(data?: object): GameStore {
    return { ...data } as GameStore;
}
