/* eslint-disable max-len */
import dedent from 'dedent';
import Moment from 'moment';
import * as Discord from 'discord.js';
import Game from '../struct/game';
import Color from '../enum/color';
import Tip from './tips';
import Player from '../struct/player';
import Team from '../enum/team';

const dateFormat = 'dddd, MMMM Do [at] H:mm A [CST-6:00]';

function safeArray(array: any[]): any[] {
  if (array.length === 0) {
    return ['**-**'];
  }

  return array;
}

// TODO: Write section description.
export function lobby(game?: Game): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed()
    .setTitle('Ready for a new Game')
    .setDescription(dedent(`
      Welcome to Awoo v0.9 prebuild.
      
      TODO: Write this section.
      Type \`/awoo join\` to join. Type \`/awoo leave\` to leave.
    `))
    .setFooter(Tip())
    .setColor(Color.Information);

  if (game) {
    embed.addField('Signed Up Players', safeArray(game.playersArray.all));

    if (game.schedule) {
      embed.addField('Game Start', Moment(game.schedule.nextInvocation()).format(dateFormat));
    }
  }

  return embed;
}
export function day(game: Game): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`Day ${game.day}`)
    .setDescription(dedent(`
      > The newborn sun greets all those fortunate enough to survive the night.
                
      You have until sundown to decide on a villager to lynch. To vote to lynch a player, type \`!accuse <name>\`
      
      **Night will begin at ${game.schedule ? Moment(game.schedule.nextInvocation()).format(dateFormat) : 'unknown time'}.**
    `))
    .setColor(Color.Information)
    .setImage('https://cdn.discordapp.com/attachments/668777649211965450/669332922725171231/village.png')
    .setFooter(Tip())
    .addField('Alive Players', safeArray(game.playersArray.alive), true)
    .addField('Eliminated Players', safeArray(game.playersArray.dead), true);
}
export function night(game: Game): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`Night ${game.day}`)
    .setDescription(dedent(`
      > As the sun sets, a chill runs down your spine. Will you wake to see the sun again?
      
      During the night, you will not be allowed to vote to lynch any players, but you can continue discussion in this channel. If you have a role with actions you can take at night, you will receive a notification via DM. 
      
      **Day will begin at ${game.schedule ? Moment(game.schedule.nextInvocation()).format(dateFormat) : 'unknown time'}.**
    `))
    .setColor(Color.Information)
    .setImage('https://cdn.discordapp.com/attachments/668777649211965450/669336328072331284/night.png')
    .setFooter(Tip())
    .addField('Alive Players', safeArray(game.playersArray.alive), true)
    .addField('Eliminated Players', safeArray(game.playersArray.dead), true);
}

export function lynch(game: Game, eliminated: Player, votes: Array<Array<Player | number>>): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`${eliminated.name} has Been Lynched`)
    .setDescription(dedent(`
      > The village has made their decision and it was decided that ${eliminated} must be lynched. They are forced into the gallows, where they hang for whatever crimes they may have committed.
      
      ${eliminated} has been eliminated with ${votes[0][1]} votes.
    `))
    .setColor(Color.WerewolfRed)
    .addField(
      'Total Lynch Votes',
      votes.map((value) => `\`${value[1]}\` ${value[0]}`),
      true,
    )
    .addField(
      'Lynch Votes',
      game.playersArray.all
        .map((player) => {
          if (player.alive) {
            if (player.accusing) {
              return `${player} voted to lynch ${player.accusing}`;
            }

            return `${player} did not vote to lynch anyone.`;
          }

          return null;
        })
        .filter((value) => value !== null),
      true,
    );
}
export function noLynch(votes: Array<Array<Player | number>>, game: Game): Discord.MessageEmbed {
  const totalLynchVotes = votes.map((value) => `\`${value[1]}\` ${value[0]}`);
  const lynchVotes = game.playersArray.all
    .map((player) => {
      if (player.alive) {
        if (player.accusing) {
          return `${player} voted to lynch ${player.accusing}`;
        }

        return `${player} did not vote to lynch anyone.`;
      }

      return null;
    })
    .filter((value) => value !== null);

  return new Discord.MessageEmbed()
    .setTitle('Nobody Was Lynched')
    .setDescription(dedent(`
      > The village was unable to make a decision on who to lynch before the day ended. 
      
      Only one player can be lynched at a time. In the event of any ties, no one will be lynched.
    `))
    .setColor(Color.VillagerBlue)
    .addField(
      'Total Lynch Votes',
      safeArray(totalLynchVotes),
      true,
    )
    .addField(
      'Lynch Votes',
      safeArray(lynchVotes),
      true,
    );
}
export function werewolf(eliminated: Player): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`${eliminated.name} has Been Eaten By Werewolves`)
    .setDescription(dedent(`
      > You all awaken to find the mangled corpse of ${eliminated} strung about the village square. It would seem they met quite a gruesome end by some wild beast last night.
      
      ${eliminated} has been eliminated by the werewolves.
    `))
    .setColor(Color.WerewolfRed);
}
export function noNightElim(): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle('A Peaceful Night')
    .setDescription(dedent(`
      > Despite everyone's fears, there were no casualties last night, but the village cannot rest as the next night may not be so peaceful.
      
      For an unknown reason, no one was eliminated.
    `))
    .setColor(Color.VillagerBlue);
}

export function villagerWin(game: Game): Discord.MessageEmbed {
  const winners = game.playersArray.all
    .filter((player) => player.role.team === Team.Villagers)
    .map((player) => `${player} \`${player.role.name}\``);
  const losers = game.playersArray.all
    .filter((player) => player.role.team !== Team.Villagers)
    .map((player) => `${player} \`${player.role.name}\``);

  return new Discord.MessageEmbed()
    .setTitle('Villagers Win')
    .setDescription(
      'The last of the werewolves were completely eliminated along with those who allied with them. The first calm night in what feels like forever, has finally come.'
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png')
    .setColor(Color.VillagerBlue)
    .setFooter(Tip())
    .addField(
      'Winning Team',
      safeArray(winners),
      true,
    )
    .addField(
      'Losing Teams',
      safeArray(losers),
      true,
    );
}

export function werewolfWin(game: Game): Discord.MessageEmbed {
  const winners = game.playersArray.all
    .filter((player) => player.role.team === Team.Werewolves)
    .map((player) => `${player} \`${player.role.name}\``);
  const losers = game.playersArray.all
    .filter((player) => player.role.team !== Team.Werewolves)
    .map((player) => `${player} \`${player.role.name}\``);

  return new Discord.MessageEmbed()
    .setTitle('Werewolves Win')
    .setDescription(
      'The villagers have been whittled down to the point where the werewolves can take complete control of the village. All of your screens fall on deaf ears as you all meet a gruesome fate.'
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/663423717753225227/666427025887854596/werewolf_t.png')
    .setColor(Color.WerewolfRed)
    .setFooter(Tip())
    .addField(
      'Winning Team',
      safeArray(winners),
      true,
    )
    .addField(
      'Losing Teams',
      safeArray(losers),
      true,
    );
}
