import * as Discord from "discord.js";

import dedent from "dedent";
import Player from "../structs/player";
import Game   from "../structs/game";

const eliminationColor = 0xff0000;
const EliminationTemplate = {
    lynch: (eliminated: Player, votes: Array<Array<Player | number>>, game: Game): Discord.RichEmbed => {
        return new Discord.RichEmbed()
            .setTitle(`${eliminated.name} has Been Lynched`)
            .setDescription(dedent(`
                > The village has made their decision and it was decided that ${eliminated} must be lynched. They are forced into the gallows, where they hang for whatever crimes they may have committed.
                
                ${eliminated} has been eliminated with ${votes[0][1]} votes.
            `))
            .setColor(eliminationColor)
            .addField(
                "Total Lynch Votes",
                votes.map((value) => `\`${value[1]}\` ${value[0]}`),
                true
            )
            .addField(
                "Lynch Votes",
                game.players.all
                    .map((player) => {
                        if (player.alive) {
                            if (player.accusing) {
                                return `${player} voted to lynch ${player.accusing}`;
                            } else {
                                return `${player} did not vote to lynch anyone.`;
                            }
                        }

                        return null;
                    })
                    .filter((value) => value !== null),
                true
            );
    },
    noLynch: (votes: Array<Array<Player | number>>, game: Game): Discord.RichEmbed => {
        const totalLynchVotes = votes.map((value) => `\`${value[1]}\` ${value[0]}`);
        const lynchVotes = game.players.all
            .map((player) => {
                if (player.alive) {
                    if (player.accusing) {
                        return `${player} voted to lynch ${player.accusing}`;
                    } else {
                        return `${player} did not vote to lynch anyone.`;
                    }
                }

                return null;
            })
            .filter((value) => value !== null);

        return new Discord.RichEmbed()
            .setTitle(`Nobody Was Lynched`)
            .setDescription(dedent(`
                > The village was unable to make a decision on who to lynch before the day ended. 
                
                Only one player can be lynched at a time. In the event of any ties, no one will be lynched.
            `))
            .setColor(0x0000ff)
            .addField(
                "Total Lynch Votes",
                totalLynchVotes.length > 1 ? totalLynchVotes : "-",
                true
            )
            .addField(
                "Lynch Votes",
                lynchVotes.length > 1 ? lynchVotes : "-",
                true
            )
    }
};

export default EliminationTemplate;
