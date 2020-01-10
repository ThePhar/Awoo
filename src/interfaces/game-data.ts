import Phases from "../structs/phases";

export default interface GameData {
    id: string;
    active?: boolean;
    phase?: Phases;
    day?: number;

    send: Function;
    sendNotification?: Function;
}
