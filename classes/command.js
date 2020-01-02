const Commands = require("../constants/commands");
const Embeds = require("../constants/embeds");

class Command {
  constructor(command, target, executor) {
    this.command = command;
    this.target = target;
    this.executor = executor;
  }

  static parse(commandString, executor) {
    const splitString = commandString.split(" ");
    const command = splitString.shift();
    let target = splitString.join(" ").toLowerCase().trim();

    // If they mentioned a user, let's regex out the id for easy lookup later.
    const discordRegex = /<@!?([0-9]+)>/;
    if (discordRegex.exec(target)) {
      target = discordRegex.exec(target)[1];
    }

    // Check if the command is actually recognized in the commands list and return a new Command object.
    for (let key in Commands) {
      if (Commands[key] === command) {
        return new Command(command, target, executor);
      }
    }

    // If we did not return a command earlier, it means it was not in the commands list.
    return undefined;
  }
  static execute(command, game) {
    switch (command.command) {
      case Commands.JOIN:
      case Commands.LEAVE:
      case Commands.CONFIRM:
        handlePlayerCommands(command, game);
        break;

      case Commands.ROLE:
      case Commands.STATUS:
        handleGameCommands(command, game);
        break;

      case Commands.RULES:
        handleRulesCommand(command, game);
        break;

      case Commands.ACCUSE:
      case Commands.LYNCH:
      case Commands.ACQUIT:
        handleTrialCommands(command, game);
        break;

      case Commands.TARGET:
        handleNightActionCommands(command, game);
        break;

      default:
        unhandledCommand(command, game.getState().meta.channel);
    }
  }
}

// TODO: Move functions to separate files.
function handlePlayerCommands(command, game) {
  const Phases = require("../constants/phases");
  const PlayerSelector = require("../selectors/players");
  const { PlayerActionCreators } = require("../actions/players");
  const Player = require("../classes/player");

  const state = game.getState;
  const channel = game.getState().meta.channel;

  let player = PlayerSelector.findPlayerById(state().players, command.executor.id);

  // Only process join and leave commands in the lobby phase.
  if (state().meta.phase === Phases.LOBBY) {
    if (command.command === Commands.JOIN) {
      // Player has already signed up!
      if (player) {
        channel.send(Embeds.Generic(`${player.mention()}, you have already signed up for this game.`));
        return;
      }

      player = new Player(command.executor);
      channel.send(Embeds.PlayerJoined(player));
      game.dispatch(PlayerActionCreators.PlayerAdd(player));
      return;
    } else if (command.command === Commands.LEAVE) {
      // Player was not signed up!
      if (!player) {
        channel.send(Embeds.Generic(`<@!${command.executor.id}>, you were already not signed up for this game.`));
        return;
      }

      channel.send(Embeds.PlayerLeft(player));
      game.dispatch(PlayerActionCreators.PlayerRemove(player));
      return;
    }
  }

  // Process confirm commands in the confirmation phase only and by players.
  if (state().meta.phase === Phases.CONFIRMATION && player) {
    // Player is already confirmed!
    if (player.confirmed) {
      channel.send(Embeds.Generic(`${player.mention()}, you have already confirmed your role.`));
      return;
    }

    channel.send(Embeds.PlayerConfirmed(player, PlayerSelector.findAllUnconfirmedPlayers(state().players)));
    game.dispatch(PlayerActionCreators.PlayerConfirmRole(player));
  }
}

function handleGameCommands(command, game) {
  const Phases = require("../constants/phases");
  const PlayerSelector = require("../selectors/players");

  const state = game.getState;
  const channel = state().meta.channel;

  let player = PlayerSelector.findPlayerById(state().players, command.executor.id);

  // Do not allow these commands from non-players or if the game is not active.
  if (!player) return;
  if (state().meta.phase === Phases.LOBBY) {
    channel.send(Embeds.Generic(`${player.mention()}, the game hasn't started yet...`));
    return;
  }

  // Message the user their role information.
  if (command.command === Commands.ROLE) {
    player.client.send(player.role.embed(state()));
  }
}

function handleRulesCommand(command, game) {
  const channel = game.getState().meta.channel;

  // The rules command can be used at any time.
  if (command.command === Commands.RULES) {
    channel.send(Embeds.Rules1());
    channel.send(Embeds.Rules2());
  }
}

function handleTrialCommands(command, game) {
  const Phases = require("../constants/phases");
  const PlayerSelector = require("../selectors/players");
  const { TrialActionCreators } = require("../actions/trial");
  const { PlayerActionCreators } = require("../actions/players");

  const state = game.getState;
  const channel = state().meta.channel;

  let player = PlayerSelector.findPlayerById(state().players, command.executor.id);

  // Do not allow commands from non-players or dead players.
  if (!player || !player.alive) return;
  // Only allow these commands during the Day phase.
  if (state().meta.phase !== Phases.DAY) return;

  // There is a trial ongoing.
  if (state().trial.active) {
    // Do not allow votes from the accused.
    if (state().trial.accused.id === player.id) return;
    // Do not allow votes from those who already voted.
    if (player.voted) return;

    // GUILTY
    if (command.command === Commands.LYNCH) {
      channel.send(Embeds.LynchVote(player, state().trial.accused));
      game.dispatch(TrialActionCreators.LynchVote());
      game.dispatch(PlayerActionCreators.PlayerVote(player));
      return;
    }
    // NOT GUILTY
    if (command.command === Commands.ACQUIT) {
      channel.send(Embeds.AcquitVote(player, state().trial.accused));
      game.dispatch(TrialActionCreators.AcquitVote());
      game.dispatch(PlayerActionCreators.PlayerVote(player));
    }
  }
  // We are in the accusations phase.
  else {
    if (command.command === Commands.ACCUSE) {
      // No target specified.
      if (command.target === "") return;
      let target = PlayerSelector.findPlayerByIdOrName(state().players, command.target);

      // No target found, ignore.
      if (!target) return;
      // Don't allow people to target themselves.
      if (target.id === player.id) return;
      // Don't allow accusations if player is in the immune list.
      if (state().trial.immune.some((immune) => immune.id === target.id)) return;

      channel.send(Embeds.Accusation(player, target));
      game.dispatch(PlayerActionCreators.PlayerAccuse(player, target));
    }
  }
}

function handleNightActionCommands(command, game) {
  const Phases = require("../constants/phases");
  const PlayerSelector = require("../selectors/players");
  const { TrialActionCreators } = require("../actions/trial");
  const { PlayerActionCreators } = require("../actions/players");

  const state = game.getState;
  const channel = state().meta.channel;

  let player = PlayerSelector.findPlayerById(state().players, command.executor.id);

  // Do not allow commands from non-players or dead players.
  if (!player || !player.alive) return;
  // Only allow these commands during the Night Phase.
  if (state().meta.phase !== Phases.NIGHT) return;
  // Don't allow players who have already used their command use it again.
  if (!player.canUseNightAction) return;
  // Don't call night action, if the player doesn't even have that ability.
  if (!player.role.nightAction) return;

  // Send the data to the role to handle their night action.
  player.role.nightAction(command, game, player);
}
function unhandledCommand(command, channel) {
  // Send a message to the game channel that an error has occurred.
  const error = `Error: \`${command.command}\` is a recognised command, but has no functionality.`;
  channel.send(Embeds.GenericError(error));
}

module.exports = Command;
