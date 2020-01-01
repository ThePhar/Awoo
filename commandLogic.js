const Phase = require('./constants/phases');
const Commands = require('./constants/commands');
const EmbedTemplates = require('./constants/embeds');

class CommandLogic {
  static execute(command, gameState) {
    switch (command.command) {
      // case Commands.RULES:
      //   this.handleRules(command);
      //   break;
      //
      // case Commands.JOIN:
      //   this.handleJoin(command, gameState);
      //   break;
      //
      // case Commands.LEAVE:
      //   this.handleLeave(command, gameState);
      //   break;
      //
      // case Commands.CONFIRM:
      //   this.handleConfirm(command, gameState);
      //   break;
      //
      // case Commands.ROLE:
      //   this.handleRole(command, gameState);
      //   break;
      //
      // case Commands.ACCUSE:
      //   this.handleAccuse(command, gameState);
      //   break;
      //
      // case Commands.ACQUIT:
      //   this.handleAcquit(command, gameState);
      //   break;
      // case Commands.LYNCH:
      //   this.handleLynch(command, gameState);
      //   break;
      //
      // case Commands.TARGET:
      //   this.handleTarget(command, gameState);
      //   break;
    }
  }

  // static handleRules(command) {
  //   // Rules can be asked for at anytime in any channel to be privately messaged to the command maker.
  //   this.sendAlert(command.client, EmbedTemplates.Rules1());
  //   this.sendAlert(command.client, EmbedTemplates.Rules2());
  // }
  // static handleJoin(command, gameState) {
  //   // Check to ensure we are in the lobby phase.
  //   if (gameState.phase !== Phase.LOBBY) {
  //     this.sendAlert(command.client, EmbedTemplates.Generic("You are not allowed to join a game in progress."));
  //     return;
  //   }
  //
  //   // Check if that player already exists.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (player) {
  //     this.sendAlert(command.server, EmbedTemplates.Generic(`You are already signed up ${player.name}.`));
  //     return;
  //   }
  //
  //   // Attempt to add the player.
  //   player = gameState.addPlayer(command.client);
  //   if (player) {
  //     this.sendAlert(command.server, EmbedTemplates.PlayerJoined(player));
  //   } else {
  //     this.sendAlert(command.server, EmbedTemplates.GenericError("Error trying to add player."));
  //   }
  // }
  // static handleLeave(command, gameState) {
  //   // Don't allow leaving games that are over or are pending phase changes.
  //   if (gameState.phase === Phase.END || gameState.pendingPhaseChange()) return; // TODO: Custom message.
  //
  //   // Before doing anything, make sure that the player we're trying to remove is even IN the game.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (!player && gameState.phase === Phase.LOBBY) {
  //     this.sendAlert(command.server, EmbedTemplates.Generic(`${command.client.username} you were not signed up anyway.`));
  //     return;
  //   } else if (!player || !player.alive) {
  //     // Just absorb the leave command if the game is on-going and someone who's not playing or dead wants to leave.
  //     return;
  //   }
  //
  //   // If we're in the lobby, just remove the player. Otherwise, we need to flag them for elimination.
  //   if (gameState.phase === Phase.LOBBY) {
  //     let success = gameState.removePlayer(command.client);
  //     if (success) {
  //       this.sendAlert(command.server, EmbedTemplates.PlayerLeft(player));
  //     } else {
  //       this.sendAlert(command.server, EmbedTemplates.GenericError("Error removing player."));
  //     }
  //   } else {
  //     // TODO: Write elimination logic.
  //     this.sendAlert(command.server, EmbedTemplates.GenericError("Phar hasn't finished this yet. Tell him he sucks."));
  //   }
  // }
  // static handleConfirm(command, gameState) {
  //   // Only handle confirmations during Day 0.
  //   if (gameState.phase !== Phase.DAY || gameState.day !== 0) return;
  //
  //   let player = gameState.getPlayer(command.client.id);
  //   // Ignore commands from non-players and confirmed players..
  //   if (!player || player.confirmed) return;
  //
  //   gameState.confirmPlayer(command.client);
  //   this.sendAlert(command.server, EmbedTemplates.PlayerConfirmed(player, gameState.getUnconfirmedPlayers()));
  // }
  // static handleRole(command, gameState) {
  //   // No point in sending the role at the end of a game or lobby.
  //   if (gameState.phase === Phase.LOBBY || gameState.phase === Phase.END) return;
  //
  //   // Only allow to get roles from players.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (!player) return;
  //
  //   // Send the user their role again.
  //   this.sendAlert(command.client, gameState.getRoleEmbed(player));
  // }
  // static handleAccuse(command, gameState) {
  //   // Only allow accusations during the Day phase after Day 0.
  //   if (gameState.day === 0 || gameState.phase !== Phase.DAY) return;
  //   // Don't allow accusations if someone has already been lynched or if a trial is in progress.
  //   if (gameState.trial.complete || gameState.trial.ongoing) return;
  //
  //   // Don't let accusations from non-players and dead players through.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (!player || !player.alive) return;
  //
  //   if (command.target === "") {
  //     return;
  //   }
  //
  //   // Find the player they're targeting.
  //   let accused = gameState.getPlayerByName(command.target);
  //   if (!accused) {
  //     // If they don't exist!
  //     this.sendAlert(command.server, EmbedTemplates.Generic(`${player.mention()} I do not know who \`${command.target}\` is.`));
  //     return;
  //   } else if (accused.length) {
  //     this.sendAlert(command.server, EmbedTemplates.Generic(`${player.mention()} there are multiple players using that in their name. Can you be more specific?`));
  //   }
  //
  //   // todo: test
  //   // else if (accused.id === accused.name) {
  //   //   this.sendAlert(command.server, EmbedTemplates.Generic(`${player.mention()} you can't accuse yourself!`));
  //   //   return;
  //   // }
  //
  //   // Assign accusation and check for other accusations.
  //   player.accuse = accused;
  //   let otherAccusation = gameState.isOtherAccusations(player, accused);
  //
  //   // Check if anyone else accused this person.
  //   if (otherAccusation) {
  //     gameState.startTrial(accused);
  //     this.sendAlert(command.server, EmbedTemplates.TrialStart(gameState.getAlivePlayers(), gameState.getDeadPlayers(), [player, otherAccusation], accused));
  //   } else {
  //     this.sendAlert(command.server, EmbedTemplates.Accusation(player, accused));
  //   }
  // }
  // static handleAcquit(command, gameState) {
  //   // Only allow votes during a trial.
  //   if (!gameState.trial.ongoing) return;
  //
  //   // Don't let votes from non-players and dead players and voted through.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (!player || !player.alive || player.voted) return;
  //
  //   // Don't allow people to vote on themselves.
  //   if (player.id === gameState.trial.accused.id) return;
  //
  //   // Increase vote for acquittal.
  //   gameState.trial.acquitVotes++;
  //   player.voted = true;
  //   this.sendAlert(command.server, EmbedTemplates.AcquitVote(player, gameState.trial.accused));
  // }
  // static handleLynch(command, gameState) {
  //   // Only allow votes during a trial.
  //   if (!gameState.trial.ongoing) return;
  //
  //   // Don't let votes from non-players and dead players and voted through.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (!player || !player.alive || player.voted) return;
  //
  //   // Don't allow people to vote on themselves.
  //   if (player.id === gameState.trial.accused.id) return;
  //
  //   // Increase vote for acquittal.
  //   gameState.trial.lynchVotes++;
  //   player.voted = true;
  //   this.sendAlert(command.server, EmbedTemplates.LynchVote(player, gameState.trial.accused));
  // }
  // static handleTarget(command, gameState) {
  //   // This is a night action event.
  //   if (gameState.phase !== Phase.NIGHT) return;
  //   console.log('passed night check');
  //
  //   // Don't let target from these players through.
  //   let player = gameState.getPlayer(command.client.id);
  //   if (!player || !player.alive || player.usedNightAction) return;
  //   console.log('passed player check');
  //
  //   // Ignore targets from those with no night actions.
  //   if (!player.role.nightAction) return;
  //   console.log('passed night action check');
  //
  //   if (command.target === "") {
  //     return;
  //   }
  //   console.log('passed no target check');
  //
  //   // Find the player they're targeting.
  //   let target = gameState.getPlayerByName(command.target);
  //   if (!target) {
  //     // If they don't exist!
  //     this.sendAlert(command.client, EmbedTemplates.Generic(`${player.mention()} I do not know who \`${command.target}\` is.`));
  //     return;
  //   } else if (target.length) {
  //     this.sendAlert(command.client, EmbedTemplates.Generic(`${player.mention()} there are multiple players using that in their name. Can you be more specific?`));
  //   }
  //   console.log('passed invalid target check');
  //   // todo: test
  //   // else if (target.id === target.name) {
  //   //   this.sendAlert(command.client, EmbedTemplates.Generic(`${player.mention()} you can't target yourself!`));
  //   //   return;
  //   // }
  //
  //   // Perform night action.
  //   player.role.nightAction(gameState, target, player);
  //   console.log('passed night action check');
  // }
}

module.exports = CommandLogic;
