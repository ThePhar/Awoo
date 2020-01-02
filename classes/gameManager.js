const moment = require("moment");
const schedule = require("node-schedule");

const Embeds = require("../constants/embeds");
const Settings = require("../constants/settings");
const Phases = require("../constants/phases");
const { PlayerActions, PlayerActionCreators } = require("../actions/players");
const { MetaActions, MetaActionCreators } = require("../actions/meta");
const PlayerSelectors = require("../selectors/players");

class GameManager {
  constructor() {
    this.scheduledPhaseChange = undefined;
    this.channel = undefined;
  }

  // Print the lobby information.
  static initialize(game) {
    this.channel = game.getState().meta.channel;

    // TODO: Add objective watcher.

    GameManager.startLobby(game);
  }

  static async startLobby(game) {
    const message = await this.channel.send(Embeds.Lobby([]));

    const stopLobby = game.subscribe(() => {
      const gameState = game.getState();

      if (gameState.meta.lastAction === PlayerActions.PLAYER_ADD || gameState.meta.lastAction === PlayerActions.PLAYER_REMOVE) {
        message.edit(Embeds.Lobby(gameState.players));

        // Check if minimum number of players have joined.
        if (gameState.players.length >= Settings.MINIMUM_PLAYERS) {
          // If we already set up the scheduler, don't worry about setting it up again.
          if (this.scheduledPhaseChange) return;

          // TODO: Remove this test.
          // const timeTilGameStart = GameManager.getNextMorningHalfDayMinimum();
          const timeTilGameStart = moment().add(5, "seconds");

          // Schedule the game to begin next day.
          this.scheduledPhaseChange = schedule.scheduleJob(timeTilGameStart.toDate(), () => {
            stopLobby();
            GameManager.startConfirmation(game);
          });

          // Send the message out.
          this.channel.send(Embeds.GameReady(timeTilGameStart.format(Settings.DATE_FORMATTING)));
        }
        else {
          // If a job was already scheduled, we need to clear it!
          if (this.scheduledPhaseChange) {
            this.scheduledPhaseChange.cancel();
            this.scheduledPhaseChange = undefined;
            this.channel.send(Embeds.GameNotReady());
          }
        }
      }
    });
  }
  static async startConfirmation(game) {
    // Change the Phase to confirmation.
    game.dispatch(MetaActionCreators.ChangePhase(Phases.CONFIRMATION));
    // Assign roles.
    game.dispatch(PlayerActionCreators.AllPlayersAssignRole());

    // Tell everyone their roles!
    game.getState().players.forEach((player) => player.client.send(player.role.embed(game.getState())));
    // Tell the channel of day one!
    this.channel.send(Embeds.FirstDay(game.getState().players));

    const stopConfirmation = game.subscribe(() => {
      const gameState = game.getState();

      if (gameState.meta.lastAction === PlayerActions.PLAYER_CONFIRM_ROLE) {
        if (PlayerSelectors.findAllUnconfirmedPlayers(gameState.players).length === 0) {
          stopConfirmation();
          // Schedule first night.
          // TODO: Remove this test.
          // const timeTilGameStart = GameManager.getNextNight();
          const timeTilGameStart = moment().add(5, "seconds");

          this.scheduledPhaseChange = schedule.scheduleJob(timeTilGameStart.toDate(), () => GameManager.startNight(game));
        }
      }
    });
  }
  static startNight(game) {
    // Increment day by 1.
    game.dispatch(MetaActionCreators.IncrementDay());
    // Change phase
    game.dispatch(MetaActionCreators.ChangePhase(Phases.NIGHT));
    // Allow night actions.
    game.dispatch(PlayerActionCreators.AllPlayersEnableNightActions());
    // TODO: Change to next morning.
    const timeTilDawn = moment().add("10", "seconds");

    const gameState = game.getState();
    // Send everyone their night action explanations.
    gameState.players.forEach((player) => {
      // Don't bother telling dead players their night actions.
      if (player.alive) {
        if (player.role.nightEmbed) {
          player.client.send(player.role.nightEmbed(gameState, player));
        }
      }
    });
    this.channel.send(Embeds.NightStart(
      PlayerSelectors.findAlivePlayers(gameState.players),
      PlayerSelectors.findDeadPlayers(gameState.players),
      gameState,
      timeTilDawn.format(Settings.DATE_FORMATTING)
    ));

    // TODO: Setup for day time.
    this.scheduledPhaseChange = schedule.scheduleJob(timeTilDawn.toDate(), () => {
      GameManager.startDay(game);
    });
  } 
  static startDay(game) {
    // Handle last night's eliminations
    // TODO:
    // Change phase
    game.dispatch(MetaActionCreators.ChangePhase(Phases.DAY));
    // Clear choices.
    game.dispatch(PlayerActionCreators.AllPlayersClearChoices());
    // TODO: Change to next night.
    const timeTilDusk = moment().add("10", "seconds");

    const gameState = game.getState();
    // Send everyone their night action explanations.
    this.channel.send(Embeds.DayStart(
      PlayerSelectors.findAlivePlayers(gameState.players),
      PlayerSelectors.findDeadPlayers(gameState.players),
      gameState,
      timeTilDusk.format(Settings.DATE_FORMATTING)
    ));

    // TODO: Add trial logic.
    this.scheduledPhaseChange = schedule.scheduleJob(timeTilDusk.toDate(), () => {
      GameManager.startNight(game);
    });
  }

  static getNextMorning() {
    const morning = moment();

    // Set the hour and minutes to a specific time.
    morning.hour(Settings.DAY_START_HOUR);
    morning.minute(0);
    morning.second(0);
    morning.millisecond(0);

    // If we are already past the morning time for today, use tomorrow.
    if (moment().isAfter(morning)) {
      morning.add(1, "days");
    }

    return morning;
  }
  static getNextMorningHalfDayMinimum() {
    const morning = moment();

    // Set the hour and minutes to a specific time.
    morning.hour(Settings.DAY_START_HOUR);
    morning.minute(0);
    morning.second(0);
    morning.millisecond(0);

    // If we are already past the morning time for today, use tomorrow.
    if (moment().isAfter(morning)) {
      morning.add(1, "days");
    }

    // Add an extra day if it's less than 12 hours until the next morning.
    if (moment().diff(morning, "hours") < 12) {
      morning.add(1, "days");
    }

    return morning;
  }
  static getNextNight() {
    const night = moment();

    // Set the hour and minutes to a specific time.
    night.hour(Settings.NIGHT_START_HOUR);
    night.minute(0);
    night.second(0);
    night.millisecond(0);

    // If we are already past the night time for today, use tomorrow.
    if (moment().isAfter(night)) {
      night.add(1, "days");
    }

    return night;
  }
}



module.exports = GameManager;
