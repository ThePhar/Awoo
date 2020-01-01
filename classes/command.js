const Commands = require("../constants/commands");

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
    switch (command) {
      default:
        unhandledCommand(command, gameState.meta.channel);
    }
  }
}

function unhandledCommand(command, channel) {
  const Embeds = require("../constants/embeds");

  // Send a message to the public channel that an error has occurred.
  const error = `Error: \`${command.command}\` is a recognised command, but has no functionality.`;
  console.clear();
  console.log(channel.send(Embeds.GenericError(error)));
}

module.exports = Command;
