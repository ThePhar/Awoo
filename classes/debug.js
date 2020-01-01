const Settings = require("../constants/settings");
const { MetaActionCreators } = require("../actions/meta");

class DebuggingFunctions {
  static executeAdminCommands(message, game) {
    const channel = game.getState().meta.channel;

    // Ignore all admin commands from non-admins.
    if (message.author.id !== Settings.PharID && message.content.startsWith("#!")) {
      channel.send(`<@!${message.author.id}>, you are not in the administrators file.`);
      return;
    }

    if (message.content === "#!clear") {
      this.clear(message.channel);
    } else if (message.content.startsWith("#!phase ")) {
      const phase = message.content.slice(8);
      game.dispatch(MetaActionCreators.ChangePhase(phase));

      channel.send(`Phase changed to: \`${game.getState().meta.phase}\``);
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
