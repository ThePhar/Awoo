const moment = require("moment");
const schedule = require("node-schedule");

const Werewolf = require("../roles/werewolf");
const Embeds = require("../constants/embeds");
const Settings = require("../constants/settings");
const Phases = require("../constants/phases");
const { PlayerActions, PlayerActionCreators } = require("../actions/players");
const { MetaActionCreators } = require("../actions/meta");
const { TrialActionCreators } = require("../actions/trial");
const PlayerSelectors = require("../selectors/players");

class GameManager {
  constructor() {
    this.scheduledPhaseChange = undefined;
    this.hourlyChecker = undefined;
    this.channel = undefined;
  }

  // Print the lobby information.
  static initialize(game) {
    this.channel = game.getState().meta.channel;
    // this.hourlyChecker = schedule.scheduleJob("0 * * * *", () => GameManager.timeRemaining(game));

    GameManager.watchForVictoryConditions(game);
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
      if (player.alive && player.role.nightEmbed) {
        // Don't send werewolves their embed on the first night.
        if (player.role.name !== "Werewolf" || gameState.meta.day > 1) {
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

    this.scheduledPhaseChange = schedule.scheduleJob(timeTilDawn.toDate(), () => {
      // Process eliminations.
      Werewolf.processEliminations(game);

      GameManager.eliminateFlaggedPlayers(game);
      GameManager.startDay(game);
    });
  }
  static startDay(game) {
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

    const stopTrialWatch = game.dispatch(() => {
      const gameState = game.getState();

      // Check if there are 2 accusations.
      if (gameState.meta.lastCommand === PlayerActions.PLAYER_ACCUSE) {
        const accusingPlayers = PlayerSelectors.findAllAccusingPlayers(gameState.players);
        let accused;
        let playersAccusing = [];

        // TODO: Rewrite this to something faster.
        // Compare each player and see if 2 different players accuse the same player.
        for (let player of accusingPlayers) {
          for (let comparer of accusingPlayers) {
            if (player.id !== comparer.id) {
              if (player.accuse.id === comparer.accuse.id) {
                accused = player.accuse;
                playersAccusing = [player, comparer];
              }
            }
          }
        }

        if (accused) {
          this.channel.send(Embeds.TrialStart(
            PlayerSelectors.findAlivePlayers(gameState.players),
            PlayerSelectors.findDeadPlayers(gameState.players),
            playersAccusing,
            accused
          ));
          game.dispatch(TrialActionCreators.StartTrial(accused));
        }
      } else if (gameState.meta.lastCommand === PlayerActions.PLAYER_VOTE) {
        GameManager.checkTrialOutcome(game, stopTrialWatch);
      }
    });

    this.scheduledPhaseChange = schedule.scheduleJob(timeTilDusk.toDate(), () => {
      if (game.getState().trial.active) {
        GameManager.checkTrialOutcome(game, stopTrialWatch, true);
      }
      game.dispatch(TrialActionCreators.ResetTrialState());
      GameManager.startNight(game);
    });
  }

  static eliminateFlaggedPlayers(game) {
    const gameState = game.getState();

    gameState.meta.playersFlaggedForElimination.forEach((elimination) => {
      this.channel.send(elimination.embed);
      game.dispatch(PlayerActionCreators.PlayerEliminate(elimination.player));
    });

    game.dispatch(MetaActionCreators.EmptyPlayersFlaggedForElimination());
  }
  static watchForVictoryConditions(game) {
    const stopWatching = game.subscribe(() => {
      const gameState = game.getState();

      const livingWerewolfTotal = PlayerSelectors.findAllLivingWerewolves(gameState.players).length;
      const livingVillagerTotal = PlayerSelectors.findAllLivingVillagers(gameState.players).length;

      // Check for villager victory.
      if (livingWerewolfTotal === 0) {
        stopWatching();
        if (this.scheduledPhaseChange) {
          this.scheduledPhaseChange.cancel();
          this.scheduledPhaseChange = undefined;
          this.hourlyChecker.cancel();
          this.hourlyChecker = undefined;
        }

        this.channel.send(Embeds.VillagerVictory(
          PlayerSelectors.findAllVillagerTeam(gameState.players),
          PlayerSelectors.findAllWerewolfTeam(gameState.players)
        ));
      }
      // Check for werewolf victory.
      if (livingWerewolfTotal >= livingVillagerTotal) {
        stopWatching();
        if (this.scheduledPhaseChange) {
          this.scheduledPhaseChange.cancel();
          this.scheduledPhaseChange = undefined;
          this.hourlyChecker.cancel();
          this.hourlyChecker = undefined;
        }

        this.channel.send(Embeds.WerewolfVictory(
          PlayerSelectors.findAllVillagerTeam(gameState.players),
          PlayerSelectors.findAllWerewolfTeam(gameState.players)
        ));
      }
    })
  }
  static checkTrialOutcome(game, stopChecking, shortCircuit = false) {
    const gameState = game.getState();
    const votingThreshold = (PlayerSelectors.findAlivePlayers(gameState.players).length - 1) / 2;

    // Lynch > Acquit
    if (gameState.trial.lynchVotes > votingThreshold || (shortCircuit && gameState.trial.lynchVotes > gameState.trial.acquitVotes)) {
      this.channel.send(Embeds.LynchElimination(gameState.trial.accused));
      game.dispatch(MetaActionCreators.FlagPlayerForElimination(new Elimination(gameState.trial.accused)));
      game.dispatch(TrialActionCreators.EndTrialLynched());
      // Stop looking for accusations today.
      stopChecking();
      GameManager.eliminateFlaggedPlayers(game);
    }
    // Lynch < Acquit
    else if (gameState.trial.acquitVotes > votingThreshold || shortCircuit) {
      this.channel.send(Embeds.Acquitted(gameState.trial.accused, gameState));
      game.dispatch(TrialActionCreators.EndTrial());
    }
  }
  static timeRemaining(game) {}

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
