import { createTestPlayer } from "../fixtures/player";
import { RichEmbed } from "discord.js";
import EliminationCause from "../../structs/elimination-cause";
import Elimination from "../../structs/elimination";

it("should instantiate an elimination object on call", () => {
    const player = createTestPlayer();
    const embed = new RichEmbed().setDescription("test");
    const cause = EliminationCause.Werewolf;

    const elimination = new Elimination(player, embed, cause);

    expect(elimination.player).toStrictEqual(player);
    expect(elimination.embed).toStrictEqual(embed);
    expect(elimination.cause).toBe(EliminationCause.Werewolf);
});
