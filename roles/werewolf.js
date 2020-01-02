const AbstractRole = require("./base");
const Teams = require("../constants/teams");
const Embeds = require("../constants/embeds");
const Commands = require("../constants/commands");

const Elimination = require("../classes/elimination");
const PlayerSelector = require("../selectors/players");
const { PlayerActionCreators } = require("../actions/players");
const { MetaActionCreators } = require("../actions/meta");

const { findAllWerewolfPlayers, findAllWerewolfTargets } = require("../selectors/players");

class Werewolf extends AbstractRole {
  constructor() {
    super("Werewolf", Teams.WEREWOLVES, Werewolf.generateEmbed);

    this.seerAppearance = "werewolf";
    this.nightEmbed = (gameState) => Embeds.WerewolfNightAction(findAllWerewolfTargets(gameState.players));
  }

  nightAction(command, game, player) {
    if (command.command === Commands.TARGET) {
      const target = PlayerSelector.findPlayerByIdOrName(game.getState().players, command.target);

      // Target not found or alive.
      if (!target) return;
      // Target not alive, no target.
      if (!target.alive) return;
      // Don't allow player to target themselves.
      if (target.id === player.id) return;
      // Don't allow werewolves to target other werewolves.
      if (target.role.name === "Werewolf") return;
      // Don't allow targeting on the first night.
      if (game.getState().meta.day === 1) return;

      game.dispatch(PlayerActionCreators.PlayerTarget(player, target));
      // TODO: Move to separate function.
      player.client.send(Embeds.WerewolfTarget(PlayerSelector.findAllWerewolvesWithCommonTarget(game.getState().players, target), target));
    }
  }

  static generateEmbed(gameState) {
    const werewolves = findAllWerewolfPlayers(gameState.players);

    return Embeds.WerewolfRole(werewolves);
  }
  static processEliminations(game) {
    // Check and choose a player to eliminate from werewolf choices.
    const werewolves = PlayerSelector.findAllWerewolvesWithTarget(game.getState().players);
    if (werewolves.length !== 0) {
      let target = werewolves[0].target;
      if (werewolves.every((werewolf) => werewolf.target.id === target.id)) {
        const elimination = new Elimination(target, Embeds.WerewolfElimination(target));
        game.dispatch(MetaActionCreators.FlagPlayerForElimination(elimination));
      }
    }
  }
}

module.exports = Werewolf;
