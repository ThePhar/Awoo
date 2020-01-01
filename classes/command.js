const Commands = require("../constants/commands");
const Embeds = require("../constants/embeds");

class Command {
  constructor(command, target) {
    this.command = command;
    this.target = target;
  }

  static parse(commandString) {
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
        return new Command(command, target);
      }
    }

    // If we did not return a command earlier, it means it was not in the commands list.
    return undefined;
  }
  static execute(command, gameState) {
    switch (command.command) {
      case Commands.JOIN:
      case Commands.LEAVE:
      case Commands.CONFIRM:
        handlePlayerCommands(command, gameState.meta.channel);
        break;

      case Commands.ROLE:
      case Commands.STATUS:
        handleGameCommands(command, gameState.meta.channel);
        break;

      case Commands.RULES:
        handleRulesCommand(command, gameState.meta.channel);
        break;

      case Commands.ACCUSE:
      case Commands.LYNCH:
      case Commands.ACQUIT:
        handleTrialCommands(command, gameState.meta.channel);
        break;

      case Commands.TARGET:
        handleNightActionCommands(command, gameState.meta.channel);
        break;

      default:
        unhandledCommand(command, gameState.meta.channel);
    }
  }
}

function handlePlayerCommands(command, channel) {
  channel.send(Embeds.Generic("Player manager."));
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
