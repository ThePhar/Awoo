const Player = require('../classes/player');
const testID = require('../constants/settings').PharID;

const pile1 = [
  new Player("Phar1", testID),
  new Player("Phar2", testID),
  new Player("Phar3", testID),
  new Player("Phar4", testID),
  new Player("Phar5", testID),
  new Player("Phar6", testID),
  new Player("Phar7", testID),
  new Player("Phar8", testID),
  new Player("Phar9", testID),
  new Player("Phar10", testID),
];

const pile2 = [
  new Player("Phar11", testID),
  new Player("Phar12", testID),
  new Player("Phar13", testID),
];

const pile3 = [
  new Player("Phar14", testID),
  new Player("Phar15", testID),
];

const pile4 = [
  new Player("Phar16", testID),
];

const player = new Player("Phar", testID);

module.exports = [pile1, pile2, pile3, pile4, player];
