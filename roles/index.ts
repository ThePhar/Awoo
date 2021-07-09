import { Player } from "../structs/player";

import arrayShuffle from "array-shuffle";
import Bodyguard from "./bodyguard";
import Hunter from "./hunter";
import Lycan from "./lycan";
import Mason from "./mason";
import Mayor from "./mayor";
import Prince from "./prince";
import Seer from "./seer";
import Sorceress from "./sorceress";
import Tanner from "./tanner";
import Werewolf from "./werewolf";
import Witch from "./witch";

// Just to make it look nice when we import commands.
export { Role } from "./base";

export function Randomize(players: Player[]): void {
    const shuffle = arrayShuffle(players);
    const random = Math.random;

    // There is always a Seer.
    (shuffle[0] as Player).role = new Seer();

    // Index variable.
    let i = 1;

    // Generate Werewolves.
    const werewolves = Math.floor(players.length / 4);
    for (; i <= werewolves; i++) {
        (shuffle[i] as Player).role = new Werewolf();
    }

    if (players.length >= 8) {
        (shuffle[i++] as Player).role = new Mayor();
        (shuffle[i++] as Player).role = new Bodyguard();
        (shuffle[i++] as Player).role = new Lycan();

        // Chance for additional Lycans.
        while (random() < Math.pow(0.5, i - 5) && i + 2 < players.length) {
            (shuffle[i++] as Player).role = new Lycan();
        }

        // Chance for Tanner.
        if (random() < 0.25 + 0.05 * (players.length - 8) && i < players.length) {
            (shuffle[i++] as Player).role = new Tanner();
        }
    }

    if (players.length >= 12) {
        (shuffle[i++] as Player).role = new Witch();
        (shuffle[i++] as Player).role = new Sorceress();
        (shuffle[i++] as Player).role = new Prince();
        (shuffle[i++] as Player).role = new Hunter();
    }

    // Masons!
    if (players.length >= 16) {
        for (let j = 0; j < werewolves - 2; j++) {
            i += j;
            (shuffle[i] as Player).role = new Mason();
        }
    }
}
