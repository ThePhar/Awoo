import Player from "./player";

export default class Trial {
    active = false;
    startable = true;

    accused: Player | null = null;

    immune: Array<Player> = [];
    lynchVotes: Array<Player> = [];
    acquitVotes: Array<Player> = [];
}
