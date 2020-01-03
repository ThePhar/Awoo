/* eslint-disable prettier/prettier */
import dedent from "dedent";
import Settings from "../settings";
import Command, {printCommand} from "../enums/Command";
import Player from "../classes/Player";

class Description {
    /* Phases */
    static PhaseLobby(): string {
        return dedent(`
            Welcome to Awoo, a realtime werewolf game, created by Zach "Phar" Parks.
            
            In order to begin a new game, we need a minimum of ${Settings.minimumPlayers}. To join the next game, `    +
            `${printCommand(Command.Join)} in this channel! For rules on how to play this version of werewolf, type `  +
            `${printCommand(Command.Rules)}. In order to receive your secret role, **you must allow DM (direct `       +
            `messages) from this bot**.
        `);
    }
    static PhaseConfirmation(): string {
        return dedent(`
            > "A curse has befallen the small village of Pharville. Most residents have been unaffected, but there `   +
            `are a few souls that have found themselves become werewolves with an insatiable hunger for human flesh.`  +
            `Will the villagers find and eliminate the werewolves, or will the werewolves completely overtake the `    +
            `village. Only time will tell."
            
            It's time to begin the game! You have all been notified via DM of your private roles, please check your `  +
            `roles for the information you need to complete your objectives. If you failed to receive your role, `     +
            `please check that you are allowing DMs from this bot and type ${printCommand(Command.Role)} to have it `  +
            `resent to you. Once you have confirmed your role, type ${printCommand(Command.Confirm)}. Once everyone `  +
            `has confirmed their role, the first night will immediately begin.
        `);
    }
    static PhaseDay(timeTilDusk: string): string {
        return dedent(`
            > "The morning sun greets all of you that survived the night, but the threat only remains. Find the `      +
            `werewolves and eliminate them, before it is too late."
            
            You have all awoken and may now discuss the events of last night freely in this channel. If you are `      +
            `ready to accuse someone of being a werewolf, type ${printCommand(Command.Accuse, ["name"])}. When `  +
            `2 players have accused the same player, an informal trial will begin to *lynch* that player.
            
            The day will end ${timeTilDusk}.
        `);
    }
    static PhaseNight(timeTilDawn: string): string {
        return dedent(`
            > "As the sun sets and darkness envelops the village, you all return to your residences to wait out the `  +
            `incoming danger and pray you will see the sun again tomorrow."
            
            During the night, you will be unable to converse in this channel, but if you have a night-active role `    +
            `you will receive a DM with what actions you have available. Be sure to take advantage of these actions, ` +
            `because you will not be able to use them again until the next night... if you survive 'til then.
            
            The night will end ${timeTilDawn}.
        `);
    }
    static PhaseTrial(accused: Player): string {
        return dedent(`
            > "${accused.mention()} has been accused of being a werewolf. The villagers forces them to the center of ` +
            `the village to make them answer for their crimes and receive their judgement."
            
            ${accused.mention()} you are currently being tried for being a werewolf. If a majority of the village `    +
            `decides to lynch you, you will be eliminated from the game. Do your best to convince them otherwise.
            
            Villagers, you are allowed to let ${accused.mention()} make a defense for themselves, but if you are `     +
            `confident they must be eliminated, type ${printCommand(Command.Lynch)}. If you have determined that `     +
            `there isn't enough proof to lynch them, type ${printCommand(Command.Acquit)}. Remember, if you decide `   +
            `to acquit this player, they may not be tried again until tomorrow, but you may accuse another player. `   +
            `If you decide to lynch them, you will not be allowed to lynch another player until tomorrow. If the day ` +
            `ends and not enough villagers vote to lynch ${accused.mention()}, they will be automatically acquitted.
        `);
    }
}

export default Description;
