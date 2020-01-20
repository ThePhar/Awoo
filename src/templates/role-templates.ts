import Color        from "../structs/color";

export default {
    villager: {
        name:       "Villager",
        pluralName: "Villagers",
        appearance: "villager",

        roleNotification: {
            title:       "You are a Villager",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png",
            color:       Color.VillagerBlue,
            description: "You are a villager and must find the werewolves and eliminate them.",
            accusationExample:
                "During the day phase, type `!lynch <name>` to vote for a player to be eliminated. When the day phase ends, the player with the most votes for them will be eliminated. You can privately send your accusation via this direct message to avoid publicly revealing your vote until the night phase begins.",
            fields: [
                {
                    name: "Objective",
                    value: "Find the werewolves and eliminate them.",
                },
                {
                    name: "Team",
                    value: "**Villagers**",
                },
            ]
        }
    },
    werewolf: {
        name:       "Werewolf",
        pluralName: "Werewolves",
        appearance: "werewolf",

        roleNotification: {
            title:       "You are a Werewolf",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427025887854596/werewolf_t.png",
            color:       Color.WerewolfRed,
            description: "You are a werewolf and learn the identity of all other werewolves, if any. Every night, eliminate a villager and avoid suspicion.",
            actions:
                "During the night phase, type `!kill <name>` to choose a player to eliminate. When the night phase ends, the player with the most werewolves targeting them will be eliminated. You must send this command via this direct message for the bot to register your command. You will be notified of all the targets your fellow werewolves make and may change your target at any time up until the end of the night phase. If there is a tie in votes, no player will be eliminated, so be sure to coordinate accordingly.",
            fields: [
                {
                    name: "Objective",
                    value: "Eliminate the villagers until the werewolves outnumber the remaining villagers.",
                },
                {
                    name: "Team",
                    value: "**Werewolves**",
                },
            ]
        }
    },
    seer: {
        name:       "Seer",
        pluralName: "Seers",

        roleNotification: {
            title:       "You are a Seer",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427035228307493/seer.png",
            description: "You are a seer and can learn the true identity of any player at night. Take care to protect your identity as you are the werewolves' biggest threat.",
            actions:
                "During the night phase, type `!inspect <name>` to target a player to learn if they are a werewolf or villager. You must send this command via this direct message for the bot to register your command. You will learn the identity of your target only when the night phase ends and if you did not get eliminated during the night phase. If you were eliminated while inspecting someone, you will not learn their identity. You can only inspect one player per night and cannot inspect eliminated players or yourself.",
        }
    },
    bodyguard: {
        name:       "Bodyguard",
        pluralName: "Bodyguards",

        roleNotification: {
            title:       "You are a Bodyguard",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427028823605258/bodyguard.png",
            description: "You are a bodyguard and can protect a player from the werewolves at night.",
            actions:
                "During the night phase, type `!protect <name>` to choose a player to protect. You must send this command via this direct message for the bot to register your command. If the player you chose to protect would be eliminated by the werewolves, they will not be eliminated. You may also protect yourself instead.",
        }
    },
    hunter: {
        name:       "Hunter",
        pluralName: "Hunters",

        roleNotification: {
            title:       "You are a Hunter",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427030245736472/hunter.png",
            description: "You are a hunter and can choose a player to also be eliminated if you are eliminated.",
            actions:
                "At any time, type `!target <name>` to choose a player to target for elimination if you are eliminated. You must send this command via this direct message for the bot to register your command. You will receive a notification if your target is eliminated. You may change your target at any time. You may not target eliminated players or yourself.",
        }
    },
    lycan: {
        name:       "Lycan",
        pluralName: "Lycans",

        roleNotification: {
            title:       "You are a Lycan",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427032007344149/lycan.png",
            description: "You are a villager that has been cursed with mild lycanthropy and will appear to the seer as a werewolf.",
        }
    },
    mayor: {
        name:       "Mayor",
        pluralName: "Mayors",

        roleNotification: {
            title:       "You are a Mayor",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427033936592924/mayor.png",
            description: "As mayor of this village, your votes to lynch players will be counted twice. That's democracy at work after all.",
        }
    },
    tanner: {
        name:       "Tanner",
        pluralName: "Tanners",

        roleNotification: {
            title:       "You are a Tanner",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427021949141035/tanner.png",
            description: "You hate your job and your life. Find a way to be eliminated.",
            color: Color.TannerBrown,
            fields: [
                {
                    name: "Objective",
                    value: "You win if you are eliminated.",
                },
                {
                    name: "Team",
                    value: "You are your own team.",
                },
            ]
        }
    },
    sorceress: {
        name:       "Sorceress",
        pluralName: "Sorceresses",

        roleNotification: {
            title:       "You are a Sorceress",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427037384441856/sorceress.png",
            description: "You are a sorceress and can learn if a player is a seer. Use that information to help the werewolves destroy this village.",
            actions:
                "During the night phase, type `!inspect <name>` to target a player to learn if they are a seer. You must send this command via this direct message for the bot to register your command. You will learn the identity of your target only when the night phase ends and if you did not get eliminated during the night phase. If you were eliminated while inspecting someone, you will not learn their identity. You can only inspect one player per night and cannot inspect eliminated players or yourself.",
        }
    },
    witch: {
        name:       "Witch",
        pluralName: "Witches",

        roleNotification: {
            title:       "You are a Witch",
            thumbnail:   "https://cdn.discordapp.com/attachments/663423717753225227/666427027389415444/witch.png",
            description: "You are a witch and have the ability to save or kill a player once per game.",
            actions:
                "During the night phase, you may type `!save` to save any player that would be eliminated by the werewolves and/or you may type `!kill <name>` to eliminate a player. You must send this command via this direct message for the bot to register your command. You can only save and kill someone once per game for each command. You may use both commands in the same night if you want. You cannot target yourself when eliminating a player.",
        }
    },
    insomniac: {
        name:       "Insomniac",
        pluralName: "Insomniacs",

        roleNotification: {
            title:       "You are an Insomniac",
            thumbnail:   "https://cdn.discordapp.com/attachments/429907716165730308/668771397916688394/insomniac.png",
            description: "You are an insomniac and can learn if a player has taken an action at night.",
            actions:
                "During the night phase, type `!inspect <name>` to find out if a player took a night action. You must send this command via this direct message for the bot to register your command. You will learn if your target took an action when the night phase ends and if you did not get eliminated during the night phase. If you were eliminated while inspecting someone, you will not learn if they took an action. You can only inspect one player per night and cannot inspect eliminated players or yourself.",
        }
    },
    minion: {
        name:       "Minion",
        pluralName: "Minions",

        roleNotification: {
            title:       "You are a Minion",
            thumbnail:   "https://cdn.discordapp.com/attachments/429907716165730308/668771402236559360/minion.png",
            description: "You are a minion and learn the identity of all the werewolves. Assist the werewolves to destroy this village.",
        }
    },
    drunk: {
        name:       "Drunk",
        pluralName: "Drunks",

        roleNotification: {
            title:       "You are a Drunk",
            thumbnail:   "https://cdn.discordapp.com/attachments/429907716165730308/668771396264001537/drunk.png",
            description: "You are a villager until the third night, when you sober up and learn your real role.",
        }
    },
    mason: {
        name:       "Mason",
        pluralName: "Masons",

        roleNotification: {
            title:       "You are a Mason",
            thumbnail:   "https://cdn.discordapp.com/attachments/429907716165730308/668771401028861962/mason.png",
            description: "You are a Mason and learn the identity of the other Mason. This is the only person you can truly trust.",
        }
    },
    loneWolf: {
        name:       "Lone Wolf",
        pluralName: "Lone Wolves",

        roleNotification: {
            title:       "You are a Lone Wolf",
            thumbnail:   "https://cdn.discordapp.com/attachments/429907716165730308/668771399409729546/lone_wolf.png",
            description: "You are a lone wolf and learn the identity of all other werewolves. Every night, eliminate a villager and avoid suspicion. You must be the only survivor, so even your fellow werewolves must be eliminated.",
            fields: [
                {
                    name: "Objective",
                    value: "Be the only player alive.",
                },
                {
                    name: "Team",
                    value: "**Werewolves**",
                },
            ]
        }
    },
    apprenticeSeer: {
        name:       "Apprentice Seer",
        pluralName: "Apprentice Seers",

        roleNotification: {
            title:       "You are an Apprentice Seer",
            thumbnail:   "https://cdn.discordapp.com/attachments/429907716165730308/668771392363429898/apprentice_seer.png",
            description: "You are an apprentice seer and if the Seer is eliminated, you become the new Seer.",
        }
    },
    doppelganger: {
        name:       "Doppelgänger",
        pluralName: "Doppelgängers",

        roleNotification: {
            title:       "You are a Doppelgänger",
            thumbnail:   "https://media.discordapp.net/attachments/429907716165730308/668771394254798878/doppelganger.png",
            description: "You are a doppelgänger and become the role of a player of your choice if they are eliminated.",
            actions:
                "During the first night phase, type `!target <name>` to choose a player to become their role if they are eliminated. You must send this command via this direct message for the bot to register your command. If the player is eliminated, you will receive a direct message with your new role. If you do not target a player on the first night, you will be treated as a villager for the remainder of the game. You cannot target yourself.",
        }
    },
}
