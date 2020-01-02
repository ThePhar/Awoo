const axios = require('axios');

const Embed = require('../constants/embeds');
const Roles = require('../constants/roles');

class Player {
  constructor(client) {
    this.client = client;

    // For debugging purposes, we will override the send function to send a HTTP object instead of a DM because discord
    // doesn't allow bots to DM other bots.
    if (this.client.bot) {
      this.client.send = (content) => {
        axios.post(`http://localhost:${parseInt(this.client.discriminator).toString()}`, {
          channel: { type: "dm" },
          author: { username: "Awoo Bot" },
          embeds: [{
            description: content.description || content,
            title: content.title
          }]
        });
      };
    }

    this.id = client.id;
    this.name = client.username;
    this.role = undefined;
    this.confirmed = false;
    this.alive = true;
    this.voted = false;
    this.canUseNightAction = false;
    this.target = undefined;
    this.accuse = undefined;
  }

  mention() {
    return `<@${this.id}>`;
  }
  seerAppearance() {
    return this.role.seerAppearance;
  }
}

module.exports = Player;
