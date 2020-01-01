const Discord = require('discord.js');
const randomItem = require('random-item');

const HelpText = require('../constants/help');

class RichEmbedTemplate {
  constructor(description, color, title, fields) {
    this.description = description;
    this.color = color;
    this.title = title;
    this.fields = fields;

    // Generate a random help text message.
    this.footer = { text: `TIP: ${randomItem(HelpText)}` };  // This is how it's formatted in Discord.RichEmbed
  }
}

function createEmbedMessage(desc, color, title, fields) {
  return new Discord.RichEmbed(
    new RichEmbedTemplate(desc, color, title, fields)
  );
}

module.exports = { RichEmbedTemplate, createEmbedMessage };
