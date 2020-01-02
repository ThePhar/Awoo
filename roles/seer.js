const AbstractRole = require("./base");
const Teams = require("../constants/teams");
const Embeds = require("../constants/embeds");

class Seer extends AbstractRole {
  constructor() {
    super("Seer", Teams.VILLAGERS, () => Embeds.SeerRole());
  }
}

module.exports = Seer;
