import { Color } from "./color";

// prettier-ignore
export const Teams: TeamDefinitions = {
    CultLeader: { name: "Cult Leader",      self: true,  color: Color.Green  },
    Tanner:     { name: "Tanner",           self: true,  color: Color.Brown  },
    LoneWolf:   { name: "Lone Wolf",        self: true,  color: Color.Orange },
    Lovers:     { name: "Forbidden Lovers", self: false, color: Color.Yellow },
    Villagers:  { name: "Villagers",        self: false, color: Color.Blue   },
    Werewolves: { name: "Werewolves",       self: false, color: Color.Red    },
    Vampires:   { name: "Vampires",         self: false, color: Color.Violet },
}

export interface TeamDefinition {
    name: string;
    self: boolean;
    color: Color;
}

export interface TeamDefinitions {
    [team: string]: TeamDefinition;
}
