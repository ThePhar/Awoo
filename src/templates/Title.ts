import Player from "../classes/Player";

class Title {
    /* Phases */
    static PhaseLobby(): string {
        return "Werewolf Lobby";
    }
    static PhaseConfirmation(): string {
        return "Confirmation Phase";
    }
    static PhaseDay(day: number): string {
        return `Day ${day}`;
    }
    static PhaseNight(day: number): string {
        return `Night ${day}`;
    }
    static PhaseTrial(accused: Player): string {
        return `Trial of ${accused.mention()}`;
    }

    /* Eliminations */
    static EliminationNone(): string {
        return "Everyone is Safe... For Now";
    }
    static EliminationWerewolf(eliminated: Player): string {
        return `${eliminated.mention()} Was Torn To Shreds`;
    }
    static EliminationLynching(eliminated: Player): string {
        return `${eliminated.mention()} Was Lynched`;
    }

    /* Victories */
    static VictoryVillagers(): string {
        return "Villagers Win";
    }
    static VictoryWerewolves(): string {
        return "Werewolves Win";
    }

    /* Roles */
    static RoleVillager(): string {
        return "You are a Villager";
    }
    static RoleWerewolf(): string {
        return "You are a Werewolf";
    }
    static RoleSeer(): string {
        return "You are a Seer";
    }

    /* Night Actions */
    static NightActionWerewolf(): string {
        return "On the Dinner Menu";
    }
    static NightActionSeer(): string {
        return "Look Into the Crystal Ball";
    }

    /* Rules */
    static Rules(): string {
        return "How to Play & What to Expect";
    }
}

export default Title;
