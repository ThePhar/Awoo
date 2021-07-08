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

export interface TeamDefinitions {
    [team: string]: {
        // Name of the team.
        name: string;
        // Is this team an individual player type of deal?
        self: boolean;
    };
}
