import dedent = require("dedent");

export default {
    fieldNames: {
        teamAndWinConditions: `Team & Win Conditions`,
        dayCommands: `Day Commands`,
        nightCommands: `Night Commands`,
        werewolves: "Werewolves",
    },
    // TODO: Replace these later.
    villager: {
        day: dedent(`
            ▹ \`!accuse <name>\`
            ▹ \`!lynch\`
            ▹ \`!acquit\`
        `),
        night: `*You have no night actions, Sweet dreams~!*`,
    },
    werewolf: {
        night: "▹ `!kill <name>`",
    },
    seer: {
        night: "▹ `!inspect <name>`",
    },
};
