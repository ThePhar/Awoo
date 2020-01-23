import Player from "../structs/player";

const ActionTemplate = {
    werewolf: {
        success: (werewolf: Player, target: Player): string =>
            `${werewolf} is now targeting to eliminate ${target}.`,

        firstNight: (): string =>
            `You cannot target players for elimination on the first night.`,
        nonNightPhase: (): string =>
            `You cannot target players for elimination outside of the night phase.`,
        noTarget: (): string =>
            `Please enter the name of the target you are trying to kill after the command.`,
        noTargetFound: (string: string): string =>
            `Sorry, I couldn't find a player under the name or id of \`${string}\`.`,
        multipleTargetsFound: (players: Player[], string: string): string =>
            `There are multiple players using that name. Try being more specific and/or include their discriminator.\n\n` +
            `*Players under \`${string}\`:*\n${ players.map(p => `${p.toString()}: \`${p.tag}\``).join("\n") }`,
        selfTarget: (): string =>
            `You cannot target yourself for elimination.`,
        deadTarget: (player: Player): string =>
            `${player} is already eliminated. Choose another target.`,
        werewolfTarget: (player: Player): string =>
            `You cannot target ${player} because they are also a werewolf. Please target a non-werewolf player.`,
    },
    seer: {
        success: (target: Player): string =>
            `You are now inspecting ${target}. If you survive the night, you will learn if they're a werewolf in the morning.`,

        nonNightPhase: (): string =>
            `You cannot inspect players outside of the night phase.`,
        noTarget: (): string =>
            `Please enter the name of the player you're trying to inspect after the command.`,
        noTargetFound: (string: string): string =>
            `Sorry, I couldn't find a player under the name or id of \`${string}\`.`,
        multipleTargetsFound: (players: Player[], string: string): string =>
            `There are multiple players using that name. Try being more specific and/or include their discriminator.\n\n` +
            `*Players under \`${string}\`:*\n${ players.map(p => `${p.toString()}: \`${p.tag}\``).join("\n") }`,
        selfTarget: (): string =>
            `You know you're a villager! Hopefully?`,
        deadTarget: (player: Player): string =>
            `${player} is eliminated. Choose another target.`,
    },


    accuse: {
        multipleTargetsFound: (players: Player[], string: string): string =>
            `There are multiple players using that name. Try being more specific and/or include their discriminator.\n\n` +
            `*Players under \`${string}\`:*\n${ players.map(p => `${p.toString()}: \`${p.tag}\``).join("\n") }`,
        noTarget: (): string =>
            `Please enter the name of the player you're trying to lynch after the command.`,
    }
};

export default ActionTemplate;
