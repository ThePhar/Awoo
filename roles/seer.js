const AbstractRole = require("./base");
const Teams = require("../constants/teams");
const Embeds = require("../constants/embeds");
const Commands = require("../constants/commands");
const PlayerSelector = require("../selectors/players");
const { PlayerActionCreators } = require("../actions/players");

const { findAlivePlayersButMe } = require("../selectors/players");

class Seer extends AbstractRole {
  constructor() {
    super("Seer", Teams.VILLAGERS, () => Embeds.SeerRole());

    // this.nightAction = () => console.log("SEER ACTION FIRED");
    this.seerAppearance = "villager";
    this.nightEmbed = (gameState, player) => Embeds.SeerNightAction(findAlivePlayersButMe(gameState.players, player));
  }

  nightAction(command, game, player) {
    if (command.command === Commands.TARGET) {
      const target = PlayerSelector.findPlayerByIdOrName(game.getState().players, command.target);

      // Target not found.
      if (!target) return;
      // Target not alive, no target.
      if (!target.alive) return;
      // Don't allow player to target themselves.
      if (target.id === player.id) return;

      player.client.send(Embeds.SeerTarget(target));
      game.dispatch(PlayerActionCreators.PlayerDisableNightAction(player));
    }
  }
}

module.exports = Seer;
