/* eslint-disable max-len */
import dedent from 'dedent';
import * as Discord from 'discord.js';
import * as Roles from '../roles';
import Role from '../interfaces/role';
import RecognisedCommand, { getCommand } from '../structs/recognised-command';
import Color from '../structs/color';
import Team from '../structs/team';
import Tip from './tips';

const villagerThumbnail = 'https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png'
const seerThumbnail = 'https://cdn.discordapp.com/attachments/663423717753225227/666427035228307493/seer.png';
const werewolfThumbnail = 'https://cdn.discordapp.com/attachments/663423717753225227/666427025887854596/werewolf_t.png';
const mayorThumbnail = 'https://cdn.discordapp.com/attachments/663423717753225227/666427033936592924/mayor.png';

/* Helper Functions */
function generateObjectiveFields(role: Role) {
  const team = `**${role.team}**`;
  let objective;

  if (role.team === Team.Villagers) {
    objective = 'Find the werewolves and eliminate them.';
  } else if (role.team === Team.Werewolves) {
    objective = 'Eliminate the villagers until living werewolves outnumber the remaining villagers.';
  }

  return [
    { name: 'Objective', value: objective, inline: true },
    { name: 'Team', value: team, inline: true },
    {
      name: 'During the Day Phase',
      value: dedent(`
        During the day, type ${getCommand(RecognisedCommand.Accuse)} in ${role.game.channel} to accuse a player of being a Werewolf.
            
        When the day phase ends, the player with the most accusations will be eliminated. In the event of a tie, no player will be eliminated.
      `),
    },
  ];
}
function safeArray(array: any[]): any[] {
  if (array.length === 0) {
    return ['**-**'];
  }

  return array;
}

/* Villager */
export function RoleVillager(role: Roles.Villager) {
  return new Discord.MessageEmbed()
    .setTitle('You are a Villager')
    .setDescription(dedent(`
      You are a villager and must find the werewolves and eliminate them.
    `))
    .setThumbnail(villagerThumbnail)
    .setColor(Color.VillagerBlue)
    .setAuthor(role.game)
    .setFooter(Tip())
    .addFields(generateObjectiveFields(role));
}

/* Seer */
export function RoleSeer(role: Roles.Seer) {
  return new Discord.MessageEmbed()
    .setTitle('You are a Seer')
    .setDescription(dedent(`
      You are a seer and can learn the identity of any player at night. Take care to protect your identity however, as you are the largest threat to the werewolves.
    `))
    .setThumbnail(seerThumbnail)
    .setColor(Color.VillagerBlue)
    .setAuthor(role.game)
    .setFooter(Tip())
    .addFields(generateObjectiveFields(role))
    .addField(
      'During the Night Phase',
      dedent(`
        During the night, you will receive a prompt via DM to select a player to inspect. You can change your selection at any point during the night, but you must confirm a selection or you will forfeit your action.
            
        When the night phase ends, if you were not eliminated, you will receive a message with information on the player you chose to inspect. If you were eliminated, you will learn nothing.
      `),
    );
}
export function ActionSeer(role: Roles.Seer) {
  const target = role.target ? role.target : '*You are not targeting any player.*';
  const prompts = [
    '⬆️ `Previous Player`',
    '⬇️ `Next Player`',
    '✅ `Target Selected Player`',
  ];

  // Get a list of all players we have already inspected.
  const inspected = [...role.inspected.entries()].map(([, player]) => player);
  const available = role.availableToInspect.map((player, index) => {
    const selection = index === role.inspectIndex ? '🟦' : '⬜';

    return `${selection} ${player}`;
  });

  return new Discord.MessageEmbed()
    .setTitle('Look into the Crystal Ball')
    .setDescription('')
    .setThumbnail(seerThumbnail)
    .setColor(Color.VillagerBlue)
    .setAuthor(role.game)
    .setFooter(Tip())
    .addFields([
      { name: 'Currently Targeting', value: target },
      { name: 'Available Targets', value: safeArray(available), inline: true },
      { name: 'Previously Inspected', value: safeArray(inspected), inline: true },
      { name: 'Prompts', value: prompts, inline: true },
    ]);
}

/* Werewolf */
export function RoleWerewolf(role: Roles.Werewolf) {
  return new Discord.MessageEmbed()
    .setTitle('You are a Werewolf')
    .setDescription(dedent(`
      You are a werewolf and learn the identity of all other werewolves, if any. 
      
      Every night, eliminate a player and avoid suspicion.
    `))
    .setThumbnail(werewolfThumbnail)
    .setColor(Color.WerewolfRed)
    .setAuthor(role.game)
    .setFooter(Tip())
    .addFields(generateObjectiveFields(role))
    .addField(
      'During the Night Phase',
      dedent(`
        During the night, you will receive a prompt via DM to select a player to eliminate. You can change your selection at any point during the night, but you must confirm a selection or you will forfeit your action.
            
        When the night phase ends, the player with the most werewolves targeting them will be eliminated. If there is not a single player with the most werewolves targeting them, no player will be eliminated.
        
        It is recommended you coordinate with your fellow Werewolves via private message to ensure your success.
      `),
    );
}
export function ActionWerewolf(role: Roles.Werewolf) {
  const prompts = [
    '⬆️ `Previous Player`',
    '⬇️ `Next Player`',
    '✅ `Target Selected Player`',
  ];
  const werewolves = role.game.playersArray.aliveWerewolves;
  const targets = werewolves.map((werewolf) => {
    const r = werewolf.role as Roles.Werewolf;

    if (r.target) {
      return `${werewolf} is targeting ${r.target}.`;
    }

    return `${werewolf} has not targeted anybody.`;
  });

  // Get a list of all players we have already inspected.
  const available = role.availableToTarget.map((player, index) => {
    const selection = index === role.targetIndex ? '🟦' : '⬜';

    return `${selection} ${player}`;
  });

  return new Discord.MessageEmbed()
    .setTitle('Look into the Crystal Ball')
    .setDescription('')
    .setThumbnail(seerThumbnail)
    .setColor(Color.VillagerBlue)
    .setAuthor(role.game)
    .setFooter(Tip())
    .addFields([
      { name: 'Currently Targeting', value: safeArray(targets) },
      { name: 'Available Targets', value: safeArray(available), inline: true },
      { name: 'Prompts', value: prompts, inline: true },
    ]);
}

/* Mayor */
export function RoleMayor(role: Roles.Mayor) {
  return new Discord.MessageEmbed()
    .setTitle('You are a Mayor')
    .setDescription(dedent(`
      As mayor of this village, your votes to accuse and lynch players will be counted twice. That's democracy at work after all.
    `))
    .setThumbnail(mayorThumbnail)
    .setColor(Color.VillagerBlue)
    .setAuthor(role.game)
    .setFooter(Tip())
    .addFields(generateObjectiveFields(role));
}
