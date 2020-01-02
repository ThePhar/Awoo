const Discord = require("discord.js");
const Settings = require("./constants/settings");
const Command = require("./classes/command");

const GameManager = require("./classes/gameManager");
const Game = require("./store/gameState");

const Client = new Discord.Client();
Client.on("ready", async () => {
  // console.clear();
  initializeBotDMReceiver();
  await initializeGameState();
  GameManager.initialize(Game);
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

      if (message.channel.type !== "dm") {
        message.delete();
      }
    } else {
      conditionallyDeleteMessagesBasedOnGameState(message);
    }
  } else {
    conditionallyDeleteMessagesBasedOnGameState(message);
  }

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
function conditionallyDeleteMessagesBasedOnGameState(message) {
  // Do not delete messages from the bot this way.
  if (message.author.id === Client.user.id) return;

  const { findPlayerById } = require('./selectors/players');
  const Phases = require('./constants/phases');

  const gameState = Game.getState();
  const player = findPlayerById(gameState.players, message.author.id);
  // Disallow messages from non-players outside of the lobby or end phases.
  if (!player && (gameState.meta.phase !== Phases.LOBBY && gameState.meta.phase !== Phases.END)) {
    message.delete();
    return;
  }
  // Disallow messages during the night phase.
  if (gameState.meta.phase === Phases.NIGHT) {
    message.delete();
  }
}

async function initializeGameState() {
  const { MetaActionCreators } = require("./actions/meta");

  const gameChannel = await Client.channels.get(Settings.GameChannelID);
  Game.dispatch(MetaActionCreators.LinkChannel(gameChannel));
}

// Login to Discord.
Client.login(Settings.Token).then(() => console.log(`Logged into Discord as ${Client.user.tag}.`));
