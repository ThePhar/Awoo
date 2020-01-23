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
    sorceress: {
        success: (target: Player): string =>
            `You are now inspecting ${target}. If you survive the night, you will learn if they're the seer in the morning.`,

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
            `You know you're not the seer! Hopefully?`,
        deadTarget: (player: Player): string =>
            `${player} is eliminated. Choose another target.`,
    },
    hunter: {
        success: (target: Player): string =>
            `You are now targeting ${target}. If you die, they will die too.`,

        noTarget: (): string =>
            `Please enter the name of the player you're trying to target after the command.`,
        noTargetFound: (string: string): string =>
            `Sorry, I couldn't find a player under the name or id of \`${string}\`.`,
        multipleTargetsFound: (players: Player[], string: string): string =>
            `There are multiple players using that name. Try being more specific and/or include their discriminator.\n\n` +
            `*Players under \`${string}\`:*\n${ players.map(p => `${p.toString()}: \`${p.tag}\``).join("\n") }`,
        selfTarget: (): string =>
            `You can't target yourself!`,
        deadTarget: (player: Player): string =>
            `${player} is eliminated. Choose another target.`,
    },
    witch: {
        successKill: (target: Player): string =>
            `You are now killing ${target}.`,
        successSave: (): string =>
            `No one will die tonight. Feel good about yourself.`,

        firstNight: (): string =>
            `You cannot target use your potions on the first night.`,
        nonNightPhase: (): string =>
            `You cannot use your potions outside of the night phase.`,
        noTarget: (): string =>
            `Please enter the name of the player you're trying to poison after the command.`,
        noTargetFound: (string: string): string =>
            `Sorry, I couldn't find a player under the name or id of \`${string}\`.`,
        multipleTargetsFound: (players: Player[], string: string): string =>
            `There are multiple players using that name. Try being more specific and/or include their discriminator.\n\n` +
            `*Players under \`${string}\`:*\n${ players.map(p => `${p.toString()}: \`${p.tag}\``).join("\n") }`,
        selfTarget: (): string =>
            `You can't poison yourself!`,
        deadTarget: (player: Player): string =>
            `${player} is eliminated. Choose another target.`,
    },
    bodyguard: {
        success: (target: Player): string =>
            `You are now protecting ${target}. If they are targeted by the werewolves, they will not be eliminated.`,

        nonNightPhase: (): string =>
            `You cannot protect players outside of the night phase.`,
        noTarget: (): string =>
            `Please enter the name of the player you're trying to protect after the command.`,
        noTargetFound: (string: string): string =>
            `Sorry, I couldn't find a player under the name or id of \`${string}\`.`,
        multipleTargetsFound: (players: Player[], string: string): string =>
            `There are multiple players using that name. Try being more specific and/or include their discriminator.\n\n` +
            `*Players under \`${string}\`:*\n${ players.map(p => `${p.toString()}: \`${p.tag}\``).join("\n") }`,
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
