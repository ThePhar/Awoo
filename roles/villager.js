const AbstractRole = require("./base");
const Teams = require("../constants/teams");
const Embeds = require("../constants/embeds");

class Villager extends AbstractRole {
  constructor() {
    super("Villager", Teams.VILLAGERS, () => Embeds.VillagerRole());
  }
}

module.exports = Villager;
