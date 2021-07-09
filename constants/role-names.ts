import { Roles } from "./roles";

// prettier-ignore
export const RoleNames: RoleNameDefinitions = {
    [Roles.AlphaWolf]:    ["Alpha Wolf",    "Alpha Wolves"],
    [Roles.Apprentice]:   ["Apprentice",    "Apprentices"],
    [Roles.Beholder]:     ["Beholder",      "Beholder"],
    [Roles.BetaWolf]:     ["Beta Wolf",     "Beta Wolves"],
    [Roles.BlackWolf]:    ["Black Wolf",    "Black Wolves"],
    [Roles.Bomber]:       ["Bomber",        "Bombers"],
    [Roles.Bodyguard]:    ["Bodyguard",     "Bodyguards"],
    [Roles.CultLeader]:   ["Cult Leader",   "Cult Leaders"],
    [Roles.Cupid]:        ["Cupid",         "Cupids"],
    [Roles.Cursed]:       ["Cursed",        "Cursed"],
    [Roles.Doppelganger]: ["Doppelgänger",  "Doppelgängers"],
    [Roles.Drunk]:        ["Drunk",         "Drunk"],
    [Roles.FruitBrute]:   ["Fruit Brute",   "Fruit Brutes"],
    [Roles.Ghost]:        ["Ghost",         "Ghosts"],
    [Roles.Idiot]:        ["Village Idiot", "Village Idiots"],
    [Roles.Insomniac]:    ["Insomniac",     "Insomniacs"],
    [Roles.Hunter]:       ["Hunter",        "Hunters"],
    [Roles.Huntress]:     ["Huntress",      "Huntresses"],
    [Roles.LoneWolf]:     ["Lone Wolf",     "Lone Wolves"],
    [Roles.Lycan]:        ["Lycan",         "Lycans"],
    [Roles.Mason]:        ["Mason",         "Masons"],
    [Roles.Mayor]:        ["Mayor",         "Mayors"],
    [Roles.Minion]:       ["Minion",        "Minions"],
    [Roles.Nostradamus]:  ["Nostradamus",   "Nostradamus"],
    [Roles.OldHag]:       ["Old Hag",       "Old Hags"],
    [Roles.Pacifist]:     ["Pacifist",      "Pacifists"],
    [Roles.Priest]:       ["Priest",        "Priests"],
    [Roles.Prince]:       ["Prince",        "Princes"],
    [Roles.Seer]:         ["Seer",          "Seers"],
    [Roles.Sorceress]:    ["Sorceress",     "Sorceresses"],
    [Roles.Spellcaster]:  ["Spellcaster",   "Spellcasters"],
    [Roles.Tanner]:       ["Tanner",        "Tanners"],
    [Roles.ToughGuy]:     ["Tough Guy",     "Tough Guys"],
    [Roles.Troublemaker]: ["Troublemaker",  "Troublemakers"],
    [Roles.Villager]:     ["Villager",      "Villagers"],
    [Roles.Werewolf]:     ["Werewolf",      "Werewolves"],
    [Roles.WildChild]:    ["Wild Child",    "Wild Children"],
    [Roles.Witch]:        ["Witch",         "Witches"],
    [Roles.WolfCub]:      ["Wolf Cub",      "Wolf Cubs"],
    [Roles.Wolfman]:      ["Wolfman",       "Wolfmen"],
    [Roles.Vampire]:      ["Vampire",       "Vampires"],
};

export type NameDefinition = [singular: string, plural: string];

export interface RoleNameDefinitions {
    [role: string]: NameDefinition;
}
