import * as Discord from 'discord.js';
import Game from '../../src/structs/game';
import Player from '../../src/structs/player';
import Phase from '../../src/structs/phase';
import Roles from '../../src/roles';
import createTextChannel from '../fixtures/createTextChannel';
import createMember from '../fixtures/createMember';

let channel: Discord.TextChannel;
let game: Game;
beforeEach(() => {
  channel = createTextChannel();
  game = new Game(channel);
});

describe('announce(content)', () => {
  test('calls send function on inner channel object', () => {
    const testMessage = 'Hello, world!';

    game.announce(testMessage);
    expect(channel.send).toHaveBeenLastCalledWith(testMessage);
  });
});

describe('addPlayer(member)', () => {
  let member: Discord.GuildMember;
  beforeEach(() => {
    member = createMember('1', 'Test');
  });

  test('create a player object and add it to the game', () => {
    const player = game.addPlayer(member);
    expect(game.getPlayer(member.id)).toBe(player);
  });
  test('return an existing player object if it already exists', () => {
    game.addPlayer(member);
    const player = game.addPlayer(member);
    expect(game.getPlayer(member.id)).toBe(player);
  });
});

describe('findPlayers(tag)', () => {
  const players: Player[] = [];
  beforeEach(() => {
    for (let n = 0; n < 6; n += 1) {
      players.push(game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`)));
    }
  });

  test('should return no arguments error if no tag supplied', () => {
    const result = game.findPlayers('');

    expect(result.error).toBe('No arguments');
    expect(result.players.length).toBe(0);
  });
  test('should return empty players if no players found', () => {
    const result = game.findPlayers('NotHere');

    expect(result.error).toBe(null);
    expect(result.players.length).toBe(0);
  });
  test('should return a single player if only 1 is found', () => {
    const result = game.findPlayers('#0001');

    expect(result.error).toBe(null);
    expect(result.players.length).toBe(1);
    expect(result.players[0].tag).toBe(players[1].tag);
  });
  test('should return multiple players if multiple match tag', () => {
    const result = game.findPlayers('Test');

    expect(result.error).toBe(null);
    expect(result.players.length).toBe(6);
  });
});

describe('removePlayer(id)', () => {
  const players: Player[] = [];
  beforeEach(() => {
    for (let n = 0; n < 2; n += 1) {
      players.push(game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`)));
    }
  });

  test('should return undefined if player does not exist under a specified id', () => {
    const player = game.removePlayer('4444');

    expect(player).toBeUndefined();
    expect(game.findPlayers('#').players.length).toBe(2);
  });
  test('should return removed player ', () => {
    const player = game.removePlayer('1');

    if (player) {
      expect(player.tag).toBe(players[1].tag);
      expect(game.findPlayers('#').players.length).toBe(1);
    } else {
      fail('Player is undefined!');
    }
  });
});

describe('startDayPhase()', () => {
  test('game state should update phase', () => {
    const expectedState = { day: game.day, phase: Phase.Day };

    game.startDayPhase();
    expect(game.phase).toBe(expectedState.phase);
    expect(game.day).toBe(game.day);
  });
});

describe('startNightPhase()', () => {
  test('game state should update phase', () => {
    const expectedState = { day: game.day + 1, phase: Phase.Night };

    game.startNightPhase();
    expect(game.phase).toBe(expectedState.phase);
    expect(game.day).toBe(game.day);
  });
});

describe('accuse(accuser, accused)', () => {
  const players: Player[] = [];
  beforeAll(() => {
    for (let n = 0; n < 4; n += 1) {
      players.push(game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`)));
    }
  });
  beforeEach(() => {
    // eslint-disable-next-line no-param-reassign
    players.forEach((player) => { player.alive = true; });
    game.resetAccusations();
  });

  test('set an accusation', () => {
    const result = game.accuse(players[0], players[1]);

    expect(result.error).toBeNull();
    expect(channel.send).toHaveBeenCalledTimes(1);
    expect(game.accusations.get(players[0].id)).toBe(players[1]);
  });
  test('change an accusation', () => {
    game.accuse(players[0], players[1]);
    const result = game.accuse(players[0], players[2]);

    expect(result.error).toBeNull();
    expect(channel.send).toHaveBeenCalledTimes(2);
    expect(game.accusations.get(players[0].id)).toBe(players[2]);
  });
  test('return an error if accuser is dead', () => {
    players[0].alive = false;
    const result = game.accuse(players[0], players[1]);

    expect(result.error).toBe('Accuser is eliminated');
    expect(channel.send).toHaveBeenCalledTimes(0);
    expect(game.accusations.get(players[0].id)).toBeUndefined();
  });
  test('return an error if accused is dead', () => {
    players[1].alive = false;
    const result = game.accuse(players[0], players[1]);

    expect(result.error).toBe('Accused is eliminated');
    expect(channel.send).toHaveBeenCalledTimes(0);
    expect(game.accusations.get(players[0].id)).toBeUndefined();
  });
  test('return an error if attempting to target the same player', () => {
    game.accuse(players[0], players[1]);
    const result = game.accuse(players[0], players[1]);

    expect(result.error).toBe('Already accusing accused player');
  });
});

describe('clearAccusation(player)', () => {
  const players: Player[] = [];
  beforeAll(() => {
    for (let n = 0; n < 2; n += 1) {
      players.push(game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`)));
    }
  });
  beforeEach(() => {
    game.resetAccusations();
  });

  test('clear an accusation if already accusing', () => {
    game.accuse(players[0], players[1]);
    game.clearAccusation(players[0]);

    expect(game.accusations.size).toBe(0);
    expect(channel.send).toHaveBeenCalledTimes(2);
  });
  test('clear an accusation if not already accusing', () => {
    game.clearAccusation(players[0]);

    expect(game.accusations.size).toBe(0);
    expect(channel.send).toHaveBeenCalledTimes(0);
  });
});

describe('hasWinConditionBeenMet()', () => {
  beforeEach(() => {
    game.players = new Map<string, Player>();

    for (let i = 0; i < 6; i += 1) {
      const member = createMember(i.toString(), `Test User ${i}`, `#000${i}`);
      const player = game.addPlayer(member);

      if (i >= 4) { player.assignRole(Roles.Werewolf); }
    }
  });

  test('return false if no win condition has been met', () => {
    expect(game.hasWinConditionBeenMet()).toBe(false);
  });
  test('return true if villagers win by all werewolves being eliminated', () => {
    (game.getPlayer('4') as Player).alive = false;
    (game.getPlayer('5') as Player).alive = false;

    expect(game.hasWinConditionBeenMet()).toBe(true);
  });
  test('return true if werewolves win by outnumbering villagers', () => {
    (game.getPlayer('2') as Player).alive = false;
    (game.getPlayer('3') as Player).alive = false;

    expect(game.hasWinConditionBeenMet()).toBe(true);
  });
  test('return true if werewolves win by everyone dying', () => {
    (game.getPlayer('0') as Player).alive = false;
    (game.getPlayer('1') as Player).alive = false;
    (game.getPlayer('2') as Player).alive = false;
    (game.getPlayer('3') as Player).alive = false;
    (game.getPlayer('4') as Player).alive = false;
    (game.getPlayer('5') as Player).alive = false;

    expect(game.hasWinConditionBeenMet()).toBe(true);
  });
});
