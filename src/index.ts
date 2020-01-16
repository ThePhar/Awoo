import { Client } from "discord.js";
import * as Env from "dotenv";
import * as Manager from "./manager-functions";

console.clear();

const result = Env.config();
if (result.error) {
    throw result.error;
}

const client = new Client();
client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => Manager.initialize(client))
    .catch((err) => { console.error(err); });
