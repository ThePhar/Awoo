const { produce } = require("immer");
const { PlayerActionCreators, PlayerActions } = require("../actions/players");
const Player = require("../classes/player");

const Villager = require("../roles/villager");
const Werewolf = require("../roles/werewolf");
const Seer = require("../roles/seer");

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
        if (action.role) {
          draft.forEach((player) => {
            // TODO: Make a separate function for this?
            switch (action.role) {
              case "villager":
                player.role = new Villager();
                return;
              case "werewolf":
                player.role = new Werewolf();
                return;
              case "seer":
                player.role = new Seer();
                return;
            }
          });
        }

        randomlyAssignRole(draft);
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
// TODO: Move to different file?
function randomlyAssignRole(players) {
  const shuffledPlayers = shuffle(players);

  shuffledPlayers[0].role = new Seer();
  shuffledPlayers[1].role = new Werewolf();
  // 6-8 players
  if (players.length < 9) {
    for (let i = 2; i < players.length; i++) {
      shuffledPlayers[i].role = new Villager();
    }
  }
  // 9-11 players
  else if (players.length < 12) {
    shuffledPlayers[2].role = new Werewolf();
    for (let i = 3; i < players.length; i++) {
      shuffledPlayers[i].role = new Villager();
    }
  }
  // 12+ players
  else {
    shuffledPlayers[2].role = new Werewolf();
    shuffledPlayers[3].role = new Werewolf();
    for (let i = 4; i < players.length; i++) {
      shuffledPlayers[i].role = new Villager();
    }
  }
}
function shuffle(array) {
  const copiedArray = array.slice(0);

  let currentIndex = copiedArray.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = copiedArray[currentIndex];
    copiedArray[currentIndex] = copiedArray[randomIndex];
    copiedArray[randomIndex] = temporaryValue;
  }

  return copiedArray;
}

module.exports = PlayersReducer;
