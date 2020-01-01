const Settings = require("../constants/settings");

class DebuggingFunctions {
  static executeAdminCommands(message) {
    // Ignore all admin commands from non-admins.
    if (message.author.id !== Settings.PharID) return;

    if (message.content === "#!clear") {
      this.clear(message.channel);
    }
  }

  static sleep(ms = 100) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  static clear(channel) {
    channel
      .fetchMessages()
      .then((messages) => messages.forEach((message) => message.delete()));
  }
}

module.exports = DebuggingFunctions;
