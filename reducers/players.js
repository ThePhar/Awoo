const { produce } = require("immer");
const { PlayerActionCreators, PlayerActions } = require("../actions/players");
const Player = require("../classes/player");

function PlayersReducer(state = [], action) {
  return produce(state, (draft) => {
    let player;

    switch (action.type) {
      case PlayerActions.PLAYER_ADD:
        draft.push(action.player);
        break;
      case PlayerActions.PLAYER_REMOVE:
        return draft.filter((player) => player.id !== action.player.id);
      case PlayerActions.PLAYER_CONFIRM_ROLE:
        player = getPlayer(action.player.id, draft);
        player.confirmed = true;
        break;
      case PlayerActions.PLAYER_ACCUSE:
        player = getPlayer(action.player.id, draft);
        player.accuse = getPlayer(action.accused.id, draft);
        break;
      case PlayerActions.PLAYER_ELIMINATE:
        player = getPlayer(action.player.id, draft);
        player.alive = false;
        break;
      case PlayerActions.PLAYER_TARGET:
        player = getPlayer(action.player.id, draft);
        player.target = getPlayer(action.target.id, draft);
        break;
      case PlayerActions.PLAYER_VOTE:
        player = getPlayer(action.player.id, draft);
        player.voted = true;
        break;
      case PlayerActions.PLAYER_DISABLE_NIGHT_ACTION:
        player = getPlayer(action.player.id, draft);
        player.canUseNightAction = false;
        break;

      case PlayerActions.ALL_PLAYERS_ENABLE_NIGHT_ACTIONS:
        draft.forEach((player) => player.canUseNightAction = true);
        break;
      case PlayerActions.ALL_PLAYERS_ASSIGN_ROLE:
        // TODO: Write random assignment code.
        break;
      case PlayerActions.ALL_PLAYERS_CLEAR_CHOICES:
        draft.forEach((player) => {
          player.target = undefined;
          player.voted = false;
          player.accuse = undefined;
        });
        break;
    }
  });
}

function getPlayer(id, players) {
  return players.find((player) => id === player.id);
}

module.exports = PlayersReducer;
