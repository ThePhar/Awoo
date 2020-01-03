import Player from "../../classes/Player";
import { Client, ClientUser } from "discord.js";

let client: ClientUser;
let player: Player;
beforeAll(() => {
    client = new ClientUser(new Client(), { id: "1234" });
    player = new Player(client);
});

it("should create a valid Player object", () => {
    // Ensure the client object is correct.
    expect(player.client).toMatchObject(client);

    // Ensure our data is set to their defaults.
    expect(player.confirmed).toBe(false);
    expect(player.alive).toBe(true);
    expect(player.voted).toBe(false);
    expect(player.activeNightAction).toBe(false);

    // Ensure these are undefined at the beginning.
    expect(player.target).toBeUndefined();
    expect(player.accuse).toBeUndefined();
    expect(player.role).toBeUndefined();
});
it("should return a discord-friendly mention string when calling mention()", () => {
    const mention = player.mention();

    expect(mention).toBe("<@!1234>");
});
