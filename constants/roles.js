const Embed = require('./embeds');

const Teams = {
  VILLAGERS: "VILLAGER",
  WEREWOLVES: "WEREWOLVES",
};

const Roles = {
  VILLAGER: {
    title: "villager",
    team: Teams.VILLAGERS,
    seerAppearance: "villager",
    embed: () => Embed.VillagerRole()
  },
  WEREWOLF: {
    title: "werewolf",
    team: Teams.WEREWOLVES,
    seerAppearance: "werewolf",
    embed: (gameState) => Embed.WerewolfRole(gameState.getWerewolfPlayers()),
    nightEmbed: (gameState) => Embed.WerewolfNightAction(gameState.getAliveVillagePlayers()),
    nightAction: (gameState, target, player) => {
      // Do not allow target of dead players or werewolves.
      if (!target.alive || target.role.title === Roles.WEREWOLF.title) return;

      let werewolves = gameState.getAliveWerewolfPlayers();
      player.target = target;

      let werewolvesWithSameTarget = werewolves.filter((wolf) => wolf.target && wolf.target.name === target.name);
      // Alert everyone to the targets.
      for (let wolf of werewolves) {
        wolf.client.send(Embed.WerewolfTarget(werewolvesWithSameTarget, target));

        // If everyone targeted the same one.
        if (werewolvesWithSameTarget.length === werewolves.length) {
          wolf.usedNightAction = true;
        }
      }

      // Flag player for werewolf elimination.
      if (werewolvesWithSameTarget.length === werewolves.length) {
        gameState.flaggedForElimination.push([target, Embed.WerewolfElimination(target)]);
      }

      gameState.printGameState();
    }
  },
  SEER: {
    title: "seer",
    team: Teams.VILLAGERS,
    seerAppearance: "villager",
    embed: () => Embed.SeerRole(),
    nightEmbed: (gameState, player) =>  {
      let alivePlayers = gameState.getAlivePlayers().filter(p => p.id !== player.id);

      return Embed.SeerNightAction(alivePlayers);
    },
    nightAction: (gameState, target, player) => {
      player.client.send(Embed.SeerTarget(target));
      player.usedNightAction = true;
    }
  }
};

module.exports = Roles;
