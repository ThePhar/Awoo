const Redux = require("redux");

const metaReducer = require("../reducers/meta");
const playerReducer = require("../reducers/players");
const trialReducer = require("../reducers/trial");

const Game = Redux.createStore(Redux.combineReducers({
  meta: metaReducer,
  players: playerReducer,
  trial: trialReducer
}));

// Print all changes to game state.
Game.subscribe(() => {
  console.clear();
  console.log(Game.getState());
});

module.exports = Game;
