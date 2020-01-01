const Discord = require("discord.js");
const Settings = require("./constants/settings");
const Command = require("./classes/command");

const Game = require("./store/gameState");

const Client = new Discord.Client();
Client.on("ready", () => {
  console.clear();
  initializeBotDMReceiver();
  initializeGameState();
});
Client.on("message", processMessages);

function processMessages(message) {
  // Only manage messages in the specified channel and DMs.
  if (message.channel.id === Settings.GameChannelID || message.channel.type === 'dm') {
    // If we are in development mode, allow debug commands from administrator.
    if (process.env.NODE_ENV === 'development') {
      require('./classes/debug').executeAdminCommands(message, Game);
    }

    inspectIncomingMessage(message);
  }
}
function inspectIncomingMessage(message) {
  // If message begins with the command prefix, treat it as a command.
  if (message.content[0] === "!") {
    const command = Command.parse(message.content, message.author);
    if (command) {
      Command.execute(command, Game);
    }
  }

  // Otherwise, handle messages based on game state.
  // TODO: Write logic for normal chat message handling.
}
function initializeBotDMReceiver() {
  if (process.env.NODE_ENV === "development") {
    const express = require("express");
    const app = express();
    app.use(express.json());

    app.post("/", (req, res) => {
      processMessages(req.body);

      res.sendStatus(200);
    });
    app.listen(4444);
  }
}

async function initializeGameState() {
  const { MetaActionCreators } = require("./actions/meta");

  const gameChannel = await Client.channels.get(Settings.GameChannelID);
  Game.dispatch(MetaActionCreators.LinkChannel(gameChannel));
}

// Login to Discord.
Client.login(Settings.Token).then(() => console.log(`Logged into Discord as ${Client.user.tag}.`));
