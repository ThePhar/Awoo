const AbstractRole = require("./base");
const Teams = require("../constants/teams");
const Embeds = require("../constants/embeds");

const { findAllWerewolfPlayers } = require("../selectors/players");

class Werewolf extends AbstractRole {
  constructor() {
    super("Werewolf", Teams.WEREWOLVES, Werewolf.generateEmbed);

    this.nightAction = () => console.log("WEREWOLF ACTION FIRED");
    this.seerAppearance = "werewolf";
  }

  static generateEmbed(gameState) {
    const werewolves = findAllWerewolfPlayers(gameState.players);

    return Embeds.WerewolfRole(werewolves);
  }
}

module.exports = Werewolf;
