const Commands = require('./commands');
const Settings = require('./settings');

// To reduce code redundancy.
const { Example, TargetedExample } = Commands;

const Descriptions = {
  // Phase Descriptions
  LOBBY: () => {
    return `Welcome to Awoo, a Discord Game based on Werewolf, created by Zachery "Phar" Parks.\n\n` +

      `In order to begin a new game, we need a minimum of ${Settings.MINIMUM_PLAYERS} to join. To join, type ` +
      `${Example(Commands.JOIN)} in this channel! For rules on how to play Werewolf, type ${Example(Commands.RULES)}. ` +
      `You will need to allow Direct Messages (DMs) from this bot to get information such as your role and to use ` +
      `your night actions, if you have any.`;
  },
  FIRST_DAY: () => {
    return `> “It's a seemingly peaceful day in the village of Pharville.”\n\n` +

      `You have all been privately messaged your randomly assigned roles for this game along with any additional ` +
      `information that may be relevant to you. Please check your messages and type ${Example(Commands.CONFIRM)} in ` +
      `this channel or in the private message to confirm you know your role. If you have not received a message, ` +
      `please ensure you have not blocked messages from this bot. You can get your role resent to you using ` +
      `${Example(Commands.ROLE)}.\n\n` +

      `Once everyone has confirmed their role, the game will continue.`;
  },
  DAY_START: () => {
    return `> “The events of last night still linger in your minds. You must act quickly before it's too late.”\n\n` +

      `You have all awoken and are free to discuss any events you have learned from last night. When you are ready to ` +
      `accuse someone, use ${TargetedExample(Commands.ACCUSE)}. When 2 players have accused the same player, a ` +
      `mob trial will begin.\n\n` +

      `Regardless of whether a player has been lynched today, the night will begin at ${Settings.NIGHT_START_TIME}.`;
  },
  NIGHT_START: () => {
    return `> “As the sun sets and darkness envelops the village, you all return to your residences for the night, ` +
      `hoping to see the sun again.”\n\n` +

      `During the night, you will be unable to speak in this channel, but if you have a night-active role, you will ` +
      `receive a DM on what night actions are available. Be sure to perform your night actions before dawn or you ` +
      `will forfeit any actions that may have given you an advantage.\n\n` +

      `The sun will rise at ${Settings.DAY_START_TIME}.`;
  },
  TRIAL_START: ([accuser1, accuser2], accused) => {
    return `> “${accuser1.name} and ${accuser2.name} have both accused ${accused.name} of being a Werewolf. They ` +
      `force ${accused.name} to the center of the village to answer for these accusations, lest they be lynched for ` +
      `the crimes they have been charged with.”\n\n` +

      `${accused.mention()}, you have been accused of being a Werewolf. Make your defense, but if a majority of the ` +
      `villagers decide you're guilty, you will be eliminated from the game.\n\n` +

      `Villagers, if you believe ${accused.name} is guilty, type ${Example(Commands.LYNCH)}. Otherwise type ` +
      `${Example(Commands.ACQUIT)}. If ${accused.name} is acquitted, they cannot be tried again in the same day. ` +
      `You have until a majority makes a decision or the day ends.\n\n` +

      `Remember that night will begin at ${Settings.NIGHT_START_TIME}.`;
  },

  // Elimination Descriptions
  NO_ELIMINATION: () => {
    return `> “You all awaken to find everyone from last night is still alive and well, but the sounds of howling ` +
      `last night tell you that the danger has not been eliminated, act quickly before something terrible happens.”`;
  },
  WEREWOLF_ELIMINATION: (eliminated) => {
    return `> “The sounds of howling drown out the screams of ${eliminated.name} as they meet a gruesome fate.”\n\n` +

      `${eliminated.mention()} has been eliminated from the game. Rest in ~~pieces~~ peace.`;
  },
  LYNCH_ELIMINATION: (lynched) => {
    return `> “Despite their pleas, the village has decided to lynch ${lynched.name}. They force him into the ` +
      `gallows, and with a swift pull of the lever, they are gone.”\n\n` +

      `${lynched.mention()} has been lynched and eliminated from the game. You are not allowed to make any more ` +
      `accusations today.`;
  },

  // Trial Results Descriptions
  ACQUITTED: (acquitted, gameState) => {
    let desc = `> “Despite the accusations made against ${acquitted.name}, the rest of the village is not completely ` +
      `convinced that they are a werewolf at this time. Hopefully they can come to an agreement on who is before it's ` +
      `too late.”\n\n` +

      `${acquitted.mention()} has been found to be not guilty of being a werewolf and are safe from being accused ` +
      `again today.`;

    // If the day isn't ending, explain to everyone they may make new accusations.
    if (!gameState.pendingPhaseChange()) {
      desc += `\n\nSince the sun is still in the sky and no one has been lynched, you may make a new accusation on ` +
        `someone else before the sun sets.`;
    }

    return desc;
  },

  // Victory Descriptions
  WEREWOLF_VICTORY: () => {
    return `> “The villagers have been whittled down to the point where the werewolves no longer need to hide their ` +
      `identity and easily overpower the remaining villagers. All of your screams fall on deaf ears as the werewolves ` +
      `take complete control of the village.”`;
  },
  VILLAGER_VICTORY: () => {
    return `> “The last of the werewolves were completely eliminated along with those who allied with them. The first ` +
      `calm night in what feels like forever, has finally come.”`;
  },

  // Role Descriptions
  VILLAGER_ROLE: () => {
    return `You are a normal villager and your sole purpose is to find the Werewolves and eliminate them.\n\n` +

      `You are on the Villager team.\n\n` +

      `You have no night actions.`;
  },
  WEREWOLF_ROLE: () => {
    return `You are a werewolf and learn the identity of any other werewolves (if any). Every night after the first ` +
      `night, all the werewolves must choose a player to eliminate. All living werewolves **must** choose the same ` +
      `target in order to eliminate the selected player. You are not allowed to target other werewolves at night. ` +
      `Try your best to keep your identities a secret and feel free to talk privately amongst the other werewolves.\n\n` +

      `You are on the Werewolf team.\n\n` +

      `To choose a player to eliminate, coordinate with your fellow werewolves (if any) and type the command ` +
      `${TargetedExample(Commands.TARGET)} in this chat. You will be notified what the other werewolves have chosen. ` +
      `You may change your target if all werewolves are not in agreement.`
  },
  SEER_ROLE: () => {
    return `You are a seer and have the special ability to, once per night, target a player to learn if they are a ` +
      `Villager or Werewolf. Try your best to spread as much information without notifying the werewolves to your ` +
      `identity, as you are their biggest threat.\n\n` +

      `You are on the Villager team.\n\n` +

      `Once per night, use ${TargetedExample(Commands.TARGET)} to learn the identity of one villager.`
  },

  // Night Action Descriptions
  WEREWOLF_NIGHT_ACTION: () => {
    return `Please choose from the following list of targets you would like to eliminate by typing ` +
      `${TargetedExample(Commands.TARGET)} here. Remember, that all of the werewolves must choose the same target for ` +
      `them to be eliminated.`;
  },
  SEER_NIGHT_ACTION: () => {
    return `It's time to peer into the true identity of one of your fellow villagers. Type ` +
      `${TargetedExample(Commands.TARGET)} here to choose a player to inspect.`;
  },

  // Target Responses
  WEREWOLF_TARGET: (predators, target) => {
    // Format based on how many werewolves have targeted this person.
    let desc = ` targeted ${target.name} for elimination.`;

    if (predators.length === 1)
      desc = `${predators[0].name} has` + desc;
    else if (predators.length === 2)
      desc = `${predators[0].name} and ${predators[1].name} have` + desc;
    else {
      // Make a nicely formatted list of names.
      // Given ["Tom", "Bob", "Alex"], should output "Tom, Bob, Alex have targeted..."
      let names = "";
      for (let i = 0; i < predators.length; i++) {
        if (i + 1 === predators.length) {
          names += "and " + predators[i].name;
        } else {
          names += predators[i].name + ", ";
        }
      }

      desc = names + desc;
    }

    return desc;
  },
  SEER_TARGET: (target) => {
    return `You peer into ${target.name}'s true identity. They are a **${target.role.seerAppearance}**.`;
  },

  // Accusations and Votes
  ACCUSATION:  (accuser, accused) => `${accuser.mention()} accuses ${accused.mention()} of being a werewolf!`,
  LYNCH_VOTE:  (voter, accused)   => `${voter.mention()} votes to lynch ${accused.name}!`,
  ACQUIT_VOTE: (voter, accused)   => `${voter.mention()} votes to acquit ${accused.name}!`,

  // Notices
  TIME_REMAINING: (gameState) => {
    const hours = gameState.remainingHours();
    const plural = hours === 1 ? "hour" : "hours";

    return `There are only ${hours} ${plural} remaining until the ${gameState.phase} ends.`;
  },
  PLAYER_JOINED: (player) => {
    return `${player.mention()} has signed up for the next game!`;
  },
  PLAYER_LEFT: (player) => {
    return `${player.mention()} has left the game.`;
  },
  PLAYER_LEFT_IN_PROGRESS: (player) => {
    return `${player.mention()} has left the game prematurely, they will be automatically eliminated the next day.`;
  },
  PLAYER_CONFIRMED: (player, unconfirmedPlayers) => {
    let desc = `${player.mention()} has confirmed their role. `;

    // Handle everyone confirmed.
    if (unconfirmedPlayers.length === 0) return desc + "Preparing to start game...";

    if (unconfirmedPlayers.length === 1)
      desc += `We are still waiting on ${unconfirmedPlayers[0].name} to confirm their role.`;
    else if (unconfirmedPlayers.length === 2)
      desc += `We are still waiting on ${unconfirmedPlayers[0].name} and ${unconfirmedPlayers[1].name} to confirm their roles`;
    else {
      // Make a nicely formatted list of names.
      // Given ["Tom", "Bob", "Alex"], should output "Tom, Bob, Alex..."
      let names = "";
      for (let i = 0; i < unconfirmedPlayers.length; i++) {
        if (i + 1 === unconfirmedPlayers.length) {
          names += "and " + unconfirmedPlayers[i].name;
        } else {
          names += unconfirmedPlayers[i].name + ", ";
        }
      }

      desc += `We are still waiting on ${names} to confirm their roles.`;
    }

    return desc;
  },

  GAME_READY: (time) => {
    return `There are now enough players to start a game. Preparing to start ${time}. ` +
      `You can still join the next game if you sign up via ${Example(Commands.JOIN)} before the start time.`;
  },
  GAME_NOT_READY: () => {
    return `There are not enough players to begin the game anymore. Waiting on more players...`;
  },

  // Rules
  RULES_PART_1: () => {
    return `Werewolf is an interactive game of deception and deduction for two teams: Villagers and Werewolves. The ` +
      `villagers don't know who the werewolves are, and the werewolves are trying to remain undiscovered while they ` +
      `slowly eliminate the villagers one at a time. This specific version of werewolf was written to allow players ` +
      `the opportunity to play via discord, unlike a traditional werewolf game with everyone in the same room at the ` +
      `same time.\n\n` +

      `This game takes place over a series of real life days and nights. Each day, the players discuss in the game ` +
      `channel who among them is a werewolf, and vote out a player. Each night, the werewolves choose a player to ` +
      `eliminate, while the Seer learns if one player is a werewolf or not. The game is over when either all the ` +
      `villagers or all the werewolves are eliminated.\n\n` +

      `I, your humble bot friend, will manage all the responsibilities a traditional moderator would in a in-person ` +
      `game of werewolf. When a game first starts, all players will be direct messaged (DM) their randomly assigned ` +
      `roles along with what objectives you must complete and what abilities you are allowed to perform and when. ` +
      `Be sure to allow DM from this bot, as I will require everyone confirm their roles via the private message. If ` +
      `you failed to get your role, use ${Example(Commands.ROLE)} in the channel to get it resent. You are not ` +
      `allowed to share your role message with anyone during a game and doing so can get you banned from any ` +
      `future games.`;
  },
  RULES_PART_2: () => {
    return `During the first night after everyone has confirmed their roles, if you have a night-action, you will be ` +
      `notified on what you can do via another DM. Be sure to respond to the message in the DM and not the channel ` +
      `as that information is supposed to be a secret between us. Werewolves are notified on to who their fellow ` +
      `werewolves are, but are not allowed to eliminate someone on the first night. The Seer can still perform their ` +
      `night action.\n\n` +

      `During the day, players are free to discuss in the game channel and make accusations on who may be a werewolf. ` +
      `When 2 players accuse the same player, a trial will begin where the accused must convince everyone that they ` +
      `are innocent. If a majority of players vote to lynch the accused player, they are eliminated from the game and ` +
      `no more accusations can be made in that same day. If a majority vote to acquit the accused player, they are not ` +
      `eliminated and are safe from future accusations on that same day. If the day has not ended, you can make new ` +
      `accusations on someone else however.\n\n` +

      `The commands that you can use will be told to you via messages sent by the bot. Please be sure to read them if, ` +
      `you are unsure as to what they are. If a player is eliminated, they are forbidden from speaking in the game ` +
      `channel and can do no actions at any phase of the game, however they are still required to not share secret ` +
      `information. If you are found to be sending secret information to give other players an advantage when you ` +
      `have been eliminated, you may be banned from future games.\n\n` +

      `The village team will win the game if all the werewolves are eliminated. The werewolf team will win if the ` +
      `number of surviving villagers are equal or less than the number of surviving werewolves.`;
  }
};

module.exports = Descriptions;
