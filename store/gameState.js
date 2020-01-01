const Redux = require("redux");

const metaReducer = require("../reducers/meta");
const playerReducer = require("../reducers/players");
const trialReducer = require("../reducers/trial");

const Game = Redux.createStore(Redux.combineReducers({ metaReducer, playerReducer, trialReducer }));

// Print all changes to game state.
Game.subscribe(() => {
  console.clear();
  console.log(Game.getState());
});

module.exports = Game;
