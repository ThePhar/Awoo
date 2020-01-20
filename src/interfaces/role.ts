import Player from "../structs/player";
import Team   from "../structs/team";

export default interface Role {
    readonly player:     Player;
    readonly name:       string;
    readonly pluralName: string;
    readonly appearance: string;
    readonly team:       Team;
}
