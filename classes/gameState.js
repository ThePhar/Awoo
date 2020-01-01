const moment = require('moment');
const Player = require('./player');

const Embed = require('../constants/embeds');
const Roles = require('../constants/roles');
const Phase = require('../constants/phases');

class GameState {
  constructor(gameChannel) {
    // Initial game state.
    this.gameChannel = gameChannel;
    this.players = [];
    this.day = 0;
    this.phase = Phase.LOBBY;
    this.trial = {
      ongoing: false,
      complete: false,
      accused: undefined,
      lynchVotes: 0,
      acquitVotes: 0,
    };
    this.flaggedForElimination = [];
    // this.nextSchedule = moment();
  }

  remainingHours() {
    // Get the difference between now and later.
    let duration = Math.ceil(moment.duration(this.nextSchedule.diff(moment())).as('hours'));

    if (duration < 0) return 0;
    return duration;
  }
  pendingPhaseChange() {
    // If we are in the Dusk or Dawn phase, we are currently about to switch over.
    return this.phase === Phase.DAWN || this.phase === Phase.DUSK;
  }
  startTrial(accused) {
    this.trial.ongoing = true;
    this.trial.accused = accused;
  }

  // Debugs
  printGameState() { console.log(this); }

  // Player management
  addPlayer(discordUser) {
    const player = new Player(discordUser.username, discordUser.id, discordUser);

    this.players.push(player);
    return player;
  }
  removePlayer(discordUser) {
    let player;

    // Check and remove player.
    let success = false;
    this.players = this.players.filter(p => {
      if (p.id === discordUser.id) {
        success = true;
        return false;  // Remove this one!
      }

      return true;
    });

    // Return if we removed the player.
    return success;
  }
  confirmPlayer(discordUser) {
    let playerConfirmed = false;
    this.players.forEach(p => {
      if (p.id === discordUser.id && !p.confirmed) {
        p.confirmed = true;
        playerConfirmed = true;
      }
    });

    return playerConfirmed;
  }
  getPlayer(id) {
    let player;

    for (let p of this.players) {
      if (p.id === id) player = p;
    }

    return player;
  }
  getPlayerByName(name) {
    let players = [];

    // Try checking by id first!
    let player = this.getPlayer(name);
    if (player)
      return player;

    // Okay, let's try by name then.
    for (let p of this.players) {
      console.log(p);
      // Return EXACT matches.
      if (p.name.toLowerCase() === name)
        return p;

      // Check to see if it matches (mostly)
      if (p.name.toLowerCase().includes(name)) {
        player = p;
        players.push(p);
      }
    }

    if (players.length < 2)
      return player;
    else
      return players;
  }
  getRoleEmbed(player) {
    return player.role.embed(this);
  }

  // Get players with specific criteria.
  getUnconfirmedPlayers() {
    return this.players.filter(player => !player.confirmed);
  }
  getWerewolfPlayers() {
    return this.players.filter(player => player.role.title === Roles.WEREWOLF.title);
  }
  getAliveWerewolfPlayers() {
    return this.players.filter(player => (player.role.title === Roles.WEREWOLF.title) && (player.alive));
  }
  getAliveVillagePlayers() {
    return this.players.filter(player => (player.role.title !== Roles.WEREWOLF.title) && (player.alive));
  }
  getAlivePlayers() {
    return this.players.filter(player => player.alive);
  }
  getDeadPlayers() {
    return this.players.filter(player => !player.alive);
  }



  // Checks
  isOtherAccusations(accuser, accused) {
    let otherAccuser;

    this.players.forEach((player) => {
      // Don't count ourselves again.
      if (player.id === accuser.id) return;

      if (player.accuse && player.accuse.id === accused.id) {
        otherAccuser = player;
      }
    });

    return otherAccuser;
  }

  // Phase management
  nextPhase() {
    // Phases should be NIGHT 1 -> DAWN -> DAY 1 -> DUSK -> NIGHT 2
    switch (this.phase) {
      case Phase.LOBBY:
        this.phase = Phase.DAY;
        this.prepareForFirstDay();
        break;
      case Phase.NIGHT:
        this.phase = Phase.DAWN;
        break;
      case Phase.DAWN:
        this.prepareForDay();
        this.phase = Phase.DAY;
        break;
      case Phase.DAY:
        this.phase = Phase.DUSK;
        break;
      case Phase.DUSK:
        this.prepareForNight();
        this.day += 1;
        this.phase = Phase.NIGHT;
        break;
    }

    this.printGameState();
  }
  prepareForNight() {
    // Check if trial in progress.
    if (this.trial.ongoing) {
      // TODO: Handle trial ending.
    }

    // Prepare game state.
    this.trial = {
      ongoing: false,
      complete: false,
      accused: undefined,
      lynchVotes: 0,
      acquitVotes: 0,
    };
    this.flaggedForElimination = [];

    // Prepare players.
    for (let player of this.players) {
      player.accuse = undefined;
      player.target = undefined;
      player.voted = false;
      player.usedNightAction = false;

      player.client.send(player.role.nightEmbed(gameState, player));
    }

    this.gameChannel.send(Embed.NightStart(this.getAlivePlayers(), this.getDeadPlayers(), this));
  }
  prepareForDay() {
    // Check for eliminations.
    if (this.flaggedForElimination.length > 0) {
      // TODO: handle elimination.
    }

    // Prepare players.
    for (let player of this.players) {
      player.accuse = undefined;
      player.target = undefined;
      player.voted = false;
      player.usedNightAction = false;
    }

    this.gameChannel.send(Embed.DayStart(this.getAlivePlayers(), this.getDeadPlayers(), this));
  }
  prepareForFirstDay() {
    // TODO: write init logic

  }
}

module.exports = GameState;
