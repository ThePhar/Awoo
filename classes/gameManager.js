const moment = require("moment");
const schedule = require("node-schedule");

const Embeds = require("../constants/embeds");
const Settings = require("../constants/settings");
const { PlayerActions } = require("../actions/players");

class GameManager {
  constructor() {
    this.scheduledPhaseChange = undefined;
  }

  // Print the lobby information.
  static initialize(game) {
    GameManager.startLobby(game);
  }

  static async startLobby(game) {
    const message = await game.getState().meta.channel.send(Embeds.Lobby([]));

    const stopLobby = game.subscribe(() => {
      const gameState = game.getState();

      if (gameState.meta.lastAction === PlayerActions.PLAYER_ADD || gameState.meta.lastAction === PlayerActions.PLAYER_REMOVE) {
        message.edit(Embeds.Lobby(gameState.players));

        // Check if minimum number of players have joined.
        if (gameState.players.length >= Settings.MINIMUM_PLAYERS) {
          // If we already set up the scheduler, don't worry about setting it up again.
          if (this.scheduledPhaseChange) return;

          const timeTilGameStart = GameManager.getNextMorningHalfDayMinimum();
          // const timeTilGameStart = moment().add(5, "seconds");

          // Schedule the game to begin next day.
          this.scheduledPhaseChange = schedule.scheduleJob(timeTilGameStart.toDate(), () => {
            stopLobby();
            // TODO: Write the confirmation phase.
            console.log("Starting confirmation");
          });

          // Send the message out.
          gameState.meta.channel.send(Embeds.GameReady(timeTilGameStart.format("dddd, MMM Do YYYY, h:mm A z")));
        }
        else {
          // If a job was already scheduled, we need to clear it!
          if (this.scheduledPhaseChange) {
            this.scheduledPhaseChange.cancel();
            this.scheduledPhaseChange = undefined;
            gameState.meta.channel.send(Embeds.GameNotReady());
          }
        }
      }
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
