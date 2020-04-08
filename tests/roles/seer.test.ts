import Seer from '../../src/roles/seer';
import Game from '../../src/structs/game';
import Player from '../../src/structs/player';
import createTextChannel from '../fixtures/createTextChannel';
import createMember from '../fixtures/createMember';
import Command from '../../src/structs/command';
import Phase from '../../src/structs/phase';

let game: Game;
let seer: Seer;
beforeEach(() => {
  game = new Game(createTextChannel());
  for (let n = 0; n < 3; n += 1) {
    game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`));
  }

  const player = game.getPlayer('0') as Player;
  player.assignRole(Seer);
  seer = player.role as Seer;
});

describe('action()', () => {
  test('do nothing if command is not `target`', () => {
    const command = Command.parse('!kill Test User 2', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if not night phase', () => {
    const command = Command.parse('!target Test User 2', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if no target specified', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if no targets found', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Anon', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if multiple targets found', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if attempting to target themselves', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test User 0', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if attempting to target an eliminated player', () => {
    game.phase = Phase.Night;
    (game.getPlayer('2') as Player).alive = false;
    const command = Command.parse('!target Test User 2', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('do nothing if attempting to target a player they have already inspected', () => {
    game.phase = Phase.Night;
    seer.inspected.set('2', game.getPlayer('2') as Player);
    const command = Command.parse('!target Test User 2', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(1);
    expect(seer.currentTarget).toBeUndefined();
  });
  test('set current target if all else is valid', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test User 2', game) as Command;

    seer.action(command);
    expect(seer.inspected.size).toBe(0);
    expect(seer.currentTarget).not.toBeUndefined();
  });
});
