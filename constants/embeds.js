const d = require('./descriptions');
const c = require('./colors');
const t = require('./titles');
const f = require('./fields');

// Rename for convenience.
const Embed = require('../classes/richEmbedTemplate').createEmbedMessage;
const Field = f.DiscordFieldGenerator;

const Embeds = {
  // Phases
  Lobby: (players) => {
    return Embed(d.LOBBY(), c.INFORMATION, t.LOBBY(), [ Field(f.ALL_PLAYERS, players) ]);
  },
  FirstDay: (players) => {
    const fields = [
      Field(f.ALIVE_PLAYERS, players, true),
      Field(f.ELIMINATED_PLAYERS, undefined, true)
    ];

    return Embed(d.FIRST_DAY(), c.DAYTIME, t.FIRST_DAY(), fields);
  },
  DayStart: (alivePlayers, deadPlayers, gameState, timeTilDusk) => {
    const fields = [
      Field(f.ALIVE_PLAYERS, alivePlayers, true),
      Field(f.ELIMINATED_PLAYERS, deadPlayers, true)
    ];

    return Embed(d.DAY_START(timeTilDusk), c.DAYTIME, t.DAY_START(gameState), fields);
  },
  NightStart: (alivePlayers, deadPlayers, gameState, timeTilDawn) => {
    const fields = [
      Field(f.ALIVE_PLAYERS, alivePlayers, true),
      Field(f.ELIMINATED_PLAYERS, deadPlayers, true)
    ];

    return Embed(d.NIGHT_START(timeTilDawn), c.NIGHTTIME, t.NIGHT_START(gameState), fields);
  },
  TrialStart: (alivePlayers, deadPlayers, accusers, accused) => {
    const fields = [
      Field(f.ALIVE_PLAYERS, alivePlayers, true),
      Field(f.ELIMINATED_PLAYERS, deadPlayers, true)
    ];

    return Embed(d.TRIAL_START(accusers, accused), c.DAYTIME, t.TRIAL_START(accused), fields);
  },

  // Eliminations
  NoElimination: () => {
    return Embed(d.NO_ELIMINATION(), c.VILLAGER_BLUE, t.NO_ELIMINATION());
  },
  WerewolfElimination: (eliminated) => {
    return Embed(d.WEREWOLF_ELIMINATION(eliminated), c.WEREWOLF_RED, t.WEREWOLF_ELIMINATION(eliminated));
  },
  LynchElimination: (lynched) => {
    return Embed(d.LYNCH_ELIMINATION(lynched), c.WEREWOLF_RED, t.LYNCH_ELIMINATION(lynched));
  },

  // Trial Results
  Acquitted: (acquitted) => {
    return Embed(d.ACQUITTED(acquitted), c.VILLAGER_BLUE, t.ACQUITTED(acquitted));
  },

  // Victories
  WerewolfVictory: (winningPlayers, losingPlayers) => {
    const fields = [
      Field(f.WINNING_TEAM, winningPlayers, true),
      Field(f.LOSING_TEAM, losingPlayers, true)
    ];

    return Embed(d.WEREWOLF_VICTORY(), c.WEREWOLF_RED, t.WEREWOLF_VICTORY(), fields);
  },
  VillagerVictory: (winningPlayers, losingPlayers) => {
    const fields = [
      Field(f.WINNING_TEAM, winningPlayers, true),
      Field(f.LOSING_TEAM, losingPlayers, true)
    ];

    return Embed(d.VILLAGER_VICTORY(), c.VILLAGER_BLUE, t.VILLAGER_VICTORY(), fields);
  },

  // Roles
  VillagerRole: () => {
    return Embed(d.VILLAGER_ROLE(), c.VILLAGER_BLUE, t.VILLAGER_ROLE());
  },
  WerewolfRole: (werewolves) => {
    return Embed(d.WEREWOLF_ROLE(), c.WEREWOLF_RED, t.WEREWOLF_ROLE(), [ Field(f.WEREWOLF_PLAYERS, werewolves) ]);
  },
  SeerRole: () => {
    return Embed(d.SEER_ROLE(), c.VILLAGER_BLUE, t.SEER_ROLE());
  },

  // Night Actions
  WerewolfNightAction: (targets) => {
    return Embed(d.WEREWOLF_NIGHT_ACTION(), c.WEREWOLF_RED, t.WEREWOLF_NIGHT_ACTION(), [ Field(f.AVAILABLE_TARGETS, targets) ]);
  },
  SeerNightAction: (unknown, known) => {
    const fields = [
      Field(f.AVAILABLE_TARGETS, unknown, true),
      // Field(f.INSPECTED_PLAYERS, known, true),
    ];

    return Embed(d.SEER_NIGHT_ACTION(), c.SPECIAL_GREEN, t.SEER_NIGHT_ACTION(), fields);
  },

  // Target Responses
  WerewolfTarget: (predators, target) => Embed(d.WEREWOLF_TARGET(predators, target), c.WEREWOLF_RED),
  SeerTarget: (target) => Embed(d.SEER_TARGET(target), c.SPECIAL_GREEN),

  // Accusations and Votes
  Accusation: (accuser, accused) => Embed(d.ACCUSATION(accuser, accused), c.INFORMATION),
  LynchVote: (voter, accused) => Embed(d.LYNCH_VOTE(voter, accused), c.WEREWOLF_RED),
  AcquitVote: (voter, accused) => Embed(d.ACQUIT_VOTE(voter, accused), c.VILLAGER_BLUE),

  // Notices
  TimeRemaining: (gameState, remainingHours) => Embed(d.TIME_REMAINING(gameState, remainingHours), c.INFORMATION),
  PlayerJoined: (player) => Embed(d.PLAYER_JOINED(player), c.INFORMATION),
  PlayerLeft: (player) => Embed(d.PLAYER_LEFT(player), c.INFORMATION),
  PlayerLeftInProgress: (player) => Embed(d.PLAYER_LEFT_IN_PROGRESS(player), c.INFORMATION),
  PlayerConfirmed: (player, unconfirmedPlayers) => Embed(d.PLAYER_CONFIRMED(player, unconfirmedPlayers), c.INFORMATION),

  GameReady: (time) => Embed(d.GAME_READY(time), c.INFORMATION),
  GameNotReady: () => Embed(d.GAME_NOT_READY(), c.INFORMATION),

  Generic: (message) => Embed(message, c.INFORMATION),
  GenericError: (message) => Embed(message + "\n\nPlease notify Phar if you see this message, as it's bad.", c.WEREWOLF_RED),

  // Rules
  Rules1: () => Embed(d.RULES_PART_1(), c.INFORMATION, t.RULES_PART_1()),
  Rules2: () => Embed(d.RULES_PART_2(), c.INFORMATION, t.RULES_PART_2()),
};

module.exports = Embeds;
