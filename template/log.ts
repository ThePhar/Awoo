import * as Discord from "discord.js";

export const ManagerInitialize = ({ user }: Discord.Client) => {
    if (!user) {
        throw new Error("Failed to get user object on client");
    }

    return `${user.username} has successfully connected to Discord.);`;
};
