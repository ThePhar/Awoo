// prettier-ignore
export const Teams: TeamDefinitions = {
    CultLeader: { name: "Cult Leader",      self: true  },
    Tanner:     { name: "Tanner",           self: true  },
    LoneWolf:   { name: "Lone Wolf",        self: true  },
    Lovers:     { name: "Forbidden Lovers", self: false },
    Villagers:  { name: "Villagers",        self: false },
    Werewolves: { name: "Werewolves",       self: false },
    Vampires:   { name: "Vampires",         self: false },
}

export interface TeamDefinition {
    name: string;
    self: boolean;
}

export interface TeamDefinitions {
    [team: string]: TeamDefinition;
}
