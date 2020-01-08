/* eslint-disable prettier/prettier */
import dedent from "dedent";
import RecognisedCommands from "../structs/recognised-commands";
import Command from "../structs/command";

const PhaseStrings = {
    lobby: {
        title: "New Game Lobby - Waiting on Players",
        description: dedent(`
            Welcome to Awoo, an auto-moderated and real-time werewolf game for your Discord server, created by Zach Parks!
            
            In order to start a new game, we need a minimum of 6 players to join via ${Command.getCode(RecognisedCommands.Join, [])}. For rules on how to play, type ${Command.getCode(RecognisedCommands.Rules, [])}.
        `),
        signedUpField: "Signed Up For Next Game",
    },
    firstNight: {
        description: dedent(`
            > “It's a seemingly peaceful night when a curse befalls the village of Pharville.”
            
            You have all been randomly assigned a role for this game along with any additional information that may be relevant to you. If you need your role reset, use ${Command.getCode(RecognisedCommands.Role, [])}. Good luck, and have fun!
        `),
    },
    day: {
        description: dedent(`
            > “After the events of last night, the village meets together to discuss and attempt to drive the werewolves away.”
            
            You have all awoken and are now free to discuss any events you have learned from last night. When you are ready to accuse a player, type ${Command.getCode(RecognisedCommands.Accuse, ["name"])}. The player with the most accusations at the end of the day will be lynched. In the event of a tie, no player will be eliminated.
        `),
    },
    night: {
        description: dedent(`
            > “As the sun sets and darkness envelops the village, you all return to your residences for the night, hoping to see the sun again.”
            
            During the night, you will not be allowed to post in the discussion channel, but if you have a night-active role, you will receive a DM with instructions. Do not ignore this message or you will forfeit your night action until next night.
        `),
    },
};

export default PhaseStrings;
