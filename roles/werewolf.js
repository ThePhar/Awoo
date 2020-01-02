const AbstractRole = require("./base");
const Teams = require("../constants/teams");
const Embeds = require("../constants/embeds");
const Commands = require("../constants/commands");

const PlayerSelector = require("../selectors/players");
const { PlayerActionCreators } = require("../actions/players");

const { findAllWerewolfPlayers } = require("../selectors/players");

class Werewolf extends AbstractRole {
  constructor() {
    super("Werewolf", Teams.WEREWOLVES, Werewolf.generateEmbed);

    this.seerAppearance = "werewolf";
  }

  nightAction(command, game, player) {
    if (command.command === Commands.TARGET) {
      const target = PlayerSelector.findPlayerByIdOrName(game.getState().players, command.target);

      // Target not found.
      if (!target) return;
      // Don't allow player to target themselves.
      if (target.id === player.id) return;
      // Don't allow werewolves to target other werewolves.
      if (target.role.name === "Werewolf") return;

      game.dispatch(PlayerActionCreators.PlayerTarget(player, target));
      // TODO: Move to separate function.
      player.client.send(Embeds.WerewolfTarget(PlayerSelector.findAllWerewolvesWithCommonTarget(game.getState().players, target), target));
    }
  }

  static generateEmbed(gameState) {
    const werewolves = findAllWerewolfPlayers(gameState.players);

    return Embeds.WerewolfRole(werewolves);
  }
}

module.exports = Werewolf;
