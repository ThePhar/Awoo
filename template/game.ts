/* eslint-disable max-len */
import dedent from 'dedent';
import * as Discord from 'discord.js';
import Game from '../struct/game';
import Color from '../enum/color';
import Tip from './tips';
import Player from '../struct/player';
import Team from '../enum/team';
import { Hunter } from '../role';

const dateFormat = 'dddd, MMMM Do [at] hh:mm:ss Z';

const rules = 'Werewolf is an interactive game of deception and deduction for two teams: Villagers and Werewolves. '
  + 'The villagers do not know who the werewolves are, and the werewolves are trying to remain undiscovered while '
  + 'they slowly eliminate the villagers, one at a time. This specific version of Werewolf was written to allow '
  + 'players the opportunity to play via Discord, unlike a traditional werewolf game with everyone in the same room '
  + 'at the same time.\n\n'
  + 'This game takes place over a series of real life days and nights. Each day, the players can discuss in the game '
  + 'channel who among them is a werewolf and vote to eliminate them (via lynching). Each night, the werewolves '
  + 'choose a player to eliminate, while the Seer learns if one player is a werewolf or not. The game is over when '
  + 'either all the werewolves are eliminated or the living werewolves outnumber the living villagers.\n\n'
  + 'There are also a number of additional roles that may come into play that could change the dynamic as the nights '
  + 'continue, but that is the gist of it.';

function safeArray(array: any[]): any[] {
  if (array.length === 0) {
    return ['**-**'];
  }

  return array;
}

export function lobby(game?: Game): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed()
    .setTitle('Ready for a new Game')
    .setDescription(dedent(`
      Welcome to Awoo v0.10.0 prebuild written by Phar.
      
      ${rules}
      
      Type \`/awoo join\` to join. Type \`/awoo leave\` to leave.
    `))
    .setFooter(Tip())
    .setColor(Color.Information);

  if (game) {
    embed.addField('Signed Up Players', safeArray(game.players.all), true);

    if (game.scheduleTime) {
      embed.addField('Game Start', game.scheduleTime.format(dateFormat));
    }
  }

  return embed;
}

export function day(game: Game): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`Day ${game.day}`)
    .setDescription(dedent(`
      > The newborn sun greets all those fortunate enough to survive the night.
                
      You have until sundown to decide on a villager to lynch, but you are not required to make lynch accusations if you desire. 
      ***NOTE: 1 Hour before the day ends, all accusations made will be final and unable to be changed, including ones already made. You can make new accusations if you haven't, but they will be final once made.***
      
      To vote to lynch a player, type \`/awoo accuse <name>\`. 
      To clear a accusation, type \`/awoo clear\`. 
      To get current lynch votes, type \`/awoo tally\`
      
      **Night will begin at ${game.scheduleTime ? game.scheduleTime.format(dateFormat) : 'unknown time'}.**
    `))
    .setColor(Color.Information)
    .setImage('https://cdn.discordapp.com/attachments/668777649211965450/669332922725171231/village.png')
    .setFooter(Tip())
    .addField('Alive Players', safeArray(game.players.alive), true)
    .addField('Eliminated Players', safeArray(game.players.eliminated), true);
}

export function night(game: Game): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`Night ${game.day}`)
    .setDescription(dedent(`
      > As the sun sets, a chill runs down your spine. Will you wake to see the sun again?
      
      During the night, you will not be allowed to vote to lynch any players, but you can continue discussion in this channel. If you have a role with actions you can take at night, you will receive a notification via DM. 
      
      **Day will begin at ${game.scheduleTime ? game.scheduleTime.format(dateFormat) : 'unknown time'}.**
    `))
    .setColor(Color.Information)
    .setImage('https://cdn.discordapp.com/attachments/668777649211965450/669336328072331284/night.png')
    .setFooter(Tip())
    .addField('Alive Players', safeArray(game.players.alive), true)
    .addField('Eliminated Players', safeArray(game.players.eliminated), true);
}

export function lynch(game: Game, votes: { player: Player, count: number }[]): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`${votes[0].player.name} has Been Lynched`)
    .setDescription(dedent(`
      > The village has made their decision and it was decided that ${votes[0].player} must be lynched. They are forced into the gallows, where they hang for whatever crimes they may have committed.

      ${votes[0].player} has been eliminated with ${votes[0].count} votes. They were a ${votes[0].player.role.appearance}.
    `))
    .setColor(Color.WerewolfRed)
    .addField(
      'Tallied Lynch Votes',
      votes.map((value) => `\`${value.count}\` ${value.player}`),
      true,
    )
    .addField(
      'Lynch Votes',
      game.players.alive
        .map((player) => {
          if (player.accusing) {
            return `${player} voted to lynch ${player.accusing}`;
          }

          return `${player} did not vote to lynch anyone.`;
        }),
      true,
    );
}

export function noLynch(game: Game, votes: { player: Player, count: number }[]): Discord.MessageEmbed {
  const totalLynchVotes = votes.map((value) => `\`${value.count}\` ${value.player}`);
  const lynchVotes = game.players.alive
    .map((player) => {
      if (player.accusing) {
        return `${player} voted to lynch ${player.accusing}`;
      }

      return `${player} did not vote to lynch anyone.`;
    })

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

export function princeLynch(game: Game, votes: { player: Player, count: number }[]): Discord.MessageEmbed {
  const totalLynchVotes = votes.map((value) => `\`${value.count}\` ${value.player}`);
  const lynchVotes = game.players.alive
    .map((player) => {
      if (player.accusing) {
        return `${player} voted to lynch ${player.accusing}`;
      }

      return `${player} did not vote to lynch anyone.`;
    })

  return new Discord.MessageEmbed()
    .setTitle('Lynching Was Overruled')
    .setDescription(dedent(`
      > Just as the village was about to lynch ${votes[0].player}, the king's men arrive to declare it unlawful to lynch the Royal Prince. You are all horrified that you almost lynched the prince. What is wrong with you people?

      ${votes[0].player} is a Prince and therefore cannot be lynched.
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

      ${eliminated} has been eliminated by the werewolves. They were a ${eliminated.role.appearance}.
    `))
    .setColor(Color.WerewolfRed);
}
export function hunterElim(hunter: Player): Discord.MessageEmbed {
  const target = (hunter.role as Hunter).target as Player;

  return new Discord.MessageEmbed()
    .setTitle(`${target.name} has Been Shot By The Hunter`)
    .setDescription(dedent(`
      > When ${hunter} was about to die, they quickly pulled out their trusty gun and immediately shot ${target}. The suddenness of this event shocked everyone.

      ${target} has been eliminated by the hunter. They were a ${target.role.appearance}.
    `))
    .setColor(Color.WerewolfRed);
}
export function witchElim(eliminated: Player): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setTitle(`${eliminated.name} has Been Poisoned By The Witch`)
    .setDescription(dedent(`
      > You all awake to find the deceased body of ${eliminated} lying in their house. The village doctor rules the death as poisoning by some witch.

      ${eliminated.name} has been eliminated by the witch. They were a ${eliminated.role.appearance}.
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
  const winners = game.players.all
    .filter((player) => player.role.team === Team.Villagers)
    .map((player) => `${player} \`${player.role.name}\``);
  const losers = game.players.all
    .filter((player) => player.role.team !== Team.Villagers)
    .map((player) => `${player} \`${player.role.name}\``);

  return new Discord.MessageEmbed()
    .setTitle('Villagers Win')
    .setDescription(
      'The last of the werewolves were completely eliminated along with those who allied with them. The first calm night in what feels like forever, has finally come.',
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
  const winners = game.players.all
    .filter((player) => player.role.team === Team.Werewolves)
    .map((player) => `${player} \`${player.role.name}\``);
  const losers = game.players.all
    .filter((player) => player.role.team !== Team.Werewolves)
    .map((player) => `${player} \`${player.role.name}\``);

  return new Discord.MessageEmbed()
    .setTitle('Werewolves Win')
    .setDescription(
      'The villagers have been whittled down to the point where the werewolves can take complete control of the village. All of your screens fall on deaf ears as you all meet a gruesome fate.',
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

export function tannerWin(game: Game): Discord.MessageEmbed {
  const winners = game.players.all
    .filter((player) => player.role.team === Team.Tanner)
    .map((player) => `${player} \`${player.role.name}\``);
  const losers = game.players.all
    .filter((player) => player.role.team !== Team.Tanner)
    .map((player) => `${player} \`${player.role.name}\``);

  return new Discord.MessageEmbed()
    .setTitle('Tanner Wins')
    .setDescription(
      'The madlad did it. The death of the tanner stuns all of you that you can\'t even focus on chasing out the werewolves and you all decide to give up on everything.',
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/663423717753225227/666427021949141035/tanner.png')
    .setColor(Color.TannerBrown)
    .setFooter(Tip())
    .addField(
      'Winner',
      safeArray(winners),
      true,
    )
    .addField(
      'Losers',
      safeArray(losers),
      true,
    );
}
