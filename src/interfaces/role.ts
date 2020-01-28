import Player  from "../structs/player";
import Team    from "../structs/team";
import Command from "../structs/command";

export default interface Role {
    readonly player:     Player;
    readonly name:       string;
    readonly pluralName: string;
    readonly appearance: string;
    readonly team:       Team;

    usedAction: boolean;

    readonly sendRole: () => void;
    readonly sendActionReminder: () => void;
    readonly action: (command: Command) => boolean;
}
