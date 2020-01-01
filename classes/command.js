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
        handleGameCommands(command, game.getState().meta.channel);
        break;

      case Commands.RULES:
        handleRulesCommand(command, game.getState().meta.channel);
        break;

      case Commands.ACCUSE:
      case Commands.LYNCH:
      case Commands.ACQUIT:
        handleTrialCommands(command, game.getState().meta.channel);
        break;

      case Commands.TARGET:
        handleNightActionCommands(command, game.getState().meta.channel);
        break;

      default:
        unhandledCommand(command, game.getState().meta.channel);
    }
  }
}

function handlePlayerCommands(command, game) {
  const Phases = require("../constants/phases");
  const PlayerSelector = require("../selectors/players");
  const { PlayerActionCreators } = require("../actions/players");
  const Player = require("../classes/player");

  const gameState = game.getState();
  const channel = gameState.meta.channel;

  let player = PlayerSelector.findPlayerById(gameState.players, command.executor.id);

  // Only process join and leave commands in the lobby phase.
  if (gameState.meta.phase === Phases.LOBBY) {
    if (command.command === Commands.JOIN) {
      // Player has already signed up!
      if (player) {
        channel.send(Embeds.Generic(`${player.mention()}, you have already signed up for this game.`));
        return;
      }

      player = new Player(command.executor);
      game.dispatch(PlayerActionCreators.PlayerAdd(player));
      channel.send(Embeds.PlayerJoined(player));
      return;
    } else if (command.command === Commands.LEAVE) {
      // Player was not signed up!
      if (!player) {
        channel.send(Embeds.Generic(`<@!${command.executor.id}>, you were already not signed up for this game.`));
        return;
      }

      game.dispatch(PlayerActionCreators.PlayerRemove(player));
      channel.send(Embeds.PlayerLeft(player));
      return;
    }
  }

  // Process confirm commands in the confirmation phase only and by players.
  if (gameState.meta.phase === Phases.CONFIRMATION && player) {}
}

function handleGameCommands(command, channel) {
  channel.send(Embeds.Generic("Game manager."));
}
function handleRulesCommand(command, channel) {
  channel.send(Embeds.Generic("Rules manager."));
}
function handleTrialCommands(command, channel) {
  channel.send(Embeds.Generic("Trial manager."));
}
function handleNightActionCommands(command, channel) {
  channel.send(Embeds.Generic("NightAction manager."));
}
function unhandledCommand(command, channel) {
  // Send a message to the game channel that an error has occurred.
  const error = `Error: \`${command.command}\` is a recognised command, but has no functionality.`;
  channel.send(Embeds.GenericError(error));
}

module.exports = Command;
