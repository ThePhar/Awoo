import * as Discord from "discord.js";
import Player       from "../structs/player";
import RoleTemplate from "./role-templates";
import getTip       from "./tips";

export function villagerRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.villager.roleNotification.title)
        .setDescription(RoleTemplate.villager.roleNotification.description)
        .setThumbnail(RoleTemplate.villager.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function werewolfRoleEmbed(guild: Discord.Guild, werewolves: Player[]): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.werewolf.roleNotification.title)
        .setDescription(RoleTemplate.werewolf.roleNotification.description)
        .setThumbnail(RoleTemplate.werewolf.roleNotification.thumbnail)
        .setColor(RoleTemplate.werewolf.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.werewolf.roleNotification.fields[0].name,
            RoleTemplate.werewolf.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.werewolf.roleNotification.fields[1].name,
            RoleTemplate.werewolf.roleNotification.fields[1].value,
            true
        )
        .addField(
            "Werewolves",
            werewolves,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.werewolf.roleNotification.actions,
        );
}

export function seerRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.seer.roleNotification.title)
        .setDescription(RoleTemplate.seer.roleNotification.description)
        .setThumbnail(RoleTemplate.seer.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.seer.roleNotification.actions,
        );
}

export function bodyguardRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.bodyguard.roleNotification.title)
        .setDescription(RoleTemplate.bodyguard.roleNotification.description)
        .setThumbnail(RoleTemplate.bodyguard.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.bodyguard.roleNotification.actions,
        );
}

export function hunterRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.hunter.roleNotification.title)
        .setDescription(RoleTemplate.hunter.roleNotification.description)
        .setThumbnail(RoleTemplate.hunter.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "Anytime",
            RoleTemplate.hunter.roleNotification.actions,
        );
}

export function lycanRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.lycan.roleNotification.title)
        .setDescription(RoleTemplate.lycan.roleNotification.description)
        .setThumbnail(RoleTemplate.lycan.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function mayorRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.mayor.roleNotification.title)
        .setDescription(RoleTemplate.mayor.roleNotification.description)
        .setThumbnail(RoleTemplate.mayor.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function tannerRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.tanner.roleNotification.title)
        .setDescription(RoleTemplate.tanner.roleNotification.description)
        .setThumbnail(RoleTemplate.tanner.roleNotification.thumbnail)
        .setColor(RoleTemplate.tanner.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.tanner.roleNotification.fields[0].name,
            RoleTemplate.tanner.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.tanner.roleNotification.fields[1].name,
            RoleTemplate.tanner.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function sorceressRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.sorceress.roleNotification.title)
        .setDescription(RoleTemplate.sorceress.roleNotification.description)
        .setThumbnail(RoleTemplate.sorceress.roleNotification.thumbnail)
        .setColor(RoleTemplate.werewolf.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.werewolf.roleNotification.fields[0].name,
            RoleTemplate.werewolf.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.werewolf.roleNotification.fields[1].name,
            RoleTemplate.werewolf.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.sorceress.roleNotification.actions,
        );
}

export function insomniacRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.insomniac.roleNotification.title)
        .setDescription(RoleTemplate.insomniac.roleNotification.description)
        .setThumbnail(RoleTemplate.insomniac.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.insomniac.roleNotification.actions,
        );
}

export function minionRoleEmbed(guild: Discord.Guild, werewolves: Player[]): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.minion.roleNotification.title)
        .setDescription(RoleTemplate.minion.roleNotification.description)
        .setThumbnail(RoleTemplate.minion.roleNotification.thumbnail)
        .setColor(RoleTemplate.werewolf.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.werewolf.roleNotification.fields[0].name,
            RoleTemplate.werewolf.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.werewolf.roleNotification.fields[1].name,
            RoleTemplate.werewolf.roleNotification.fields[1].value,
            true
        )
        .addField(
            "Werewolves",
            werewolves,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function drunkRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.drunk.roleNotification.title)
        .setDescription(RoleTemplate.drunk.roleNotification.description)
        .setThumbnail(RoleTemplate.drunk.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function masonRoleEmbed(guild: Discord.Guild, masons: Player[]): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.mason.roleNotification.title)
        .setDescription(RoleTemplate.mason.roleNotification.description)
        .setThumbnail(RoleTemplate.mason.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "Masons",
            masons,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function loneWolfRoleEmbed(guild: Discord.Guild, werewolves: Player[]): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.loneWolf.roleNotification.title)
        .setDescription(RoleTemplate.loneWolf.roleNotification.description)
        .setThumbnail(RoleTemplate.loneWolf.roleNotification.thumbnail)
        .setColor(RoleTemplate.werewolf.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.loneWolf.roleNotification.fields[0].name,
            RoleTemplate.loneWolf.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.loneWolf.roleNotification.fields[1].name,
            RoleTemplate.loneWolf.roleNotification.fields[1].value,
            true
        )
        .addField(
            "Werewolves",
            werewolves,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.werewolf.roleNotification.actions,
        );
}

export function apprenticeSeerRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.apprenticeSeer.roleNotification.title)
        .setDescription(RoleTemplate.apprenticeSeer.roleNotification.description)
        .setThumbnail(RoleTemplate.apprenticeSeer.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        );
}

export function doppelgangerRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.doppelganger.roleNotification.title)
        .setDescription(RoleTemplate.doppelganger.roleNotification.description)
        .setThumbnail(RoleTemplate.doppelganger.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the First Night",
            RoleTemplate.doppelganger.roleNotification.actions,
        );
}

export function witchRoleEmbed(guild: Discord.Guild): Discord.RichEmbed {
    return new Discord.RichEmbed()
        .setTitle(RoleTemplate.witch.roleNotification.title)
        .setDescription(RoleTemplate.witch.roleNotification.description)
        .setThumbnail(RoleTemplate.witch.roleNotification.thumbnail)
        .setColor(RoleTemplate.villager.roleNotification.color)
        .setAuthor(guild.name, guild.iconURL)
        .setFooter(getTip())
        .addField(
            RoleTemplate.villager.roleNotification.fields[0].name,
            RoleTemplate.villager.roleNotification.fields[0].value,
            true
        )
        .addField(
            RoleTemplate.villager.roleNotification.fields[1].name,
            RoleTemplate.villager.roleNotification.fields[1].value,
            true
        )
        .addField(
            "During the Day",
            RoleTemplate.villager.roleNotification.accusationExample,
        )
        .addField(
            "During the Night",
            RoleTemplate.witch.roleNotification.actions,
        );
}