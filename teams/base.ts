import { GameInterface, TeamInterface } from "../interfaces";
import { Color } from "../constants/color";

export abstract class Team implements TeamInterface {
    public abstract readonly color: Color | number;
    public abstract readonly data: any;
    public abstract readonly description: string;
    public abstract readonly iconURL: string;
    public abstract readonly objective: string;
    public abstract readonly name: string;
    public abstract readonly solo: boolean;

    /**
     * Checks to see if this team has reached their win condition based on the current game state.
     * @param game
     */
    public abstract reachedWinCondition(game: GameInterface): boolean;
}
