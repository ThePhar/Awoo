import Game from '../../src/structs/game';
import Player from '../../src/structs/player';
import createTextChannel from '../fixtures/createTextChannel';
import createMember from '../fixtures/createMember';
import Command from '../../src/structs/command';
import Phase from '../../src/structs/phase';
import Werewolf from '../../src/roles/werewolf';

let game: Game;
let werewolf: Werewolf;
beforeEach(() => {
  game = new Game(createTextChannel());
  for (let n = 0; n < 3; n += 1) {
    game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`));
  }

  game.day = 2;

  const player = game.getPlayer('0') as Player;
  const otherWere = game.getPlayer('1') as Player;
  player.assignRole(Werewolf);
  otherWere.assignRole(Werewolf);
  werewolf = player.role as Werewolf;
});

describe('action()', () => {
  test('do nothing if command is not `target`', () => {
    const command = Command.parse('!kill Test User 2', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if not night phase', () => {
    const command = Command.parse('!target Test User 2', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if first night', () => {
    game.phase = Phase.Night;
    game.day = 1;
    const command = Command.parse('!target Test User 2', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if no target specified', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if no targets found', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Anon', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if multiple targets found', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if attempting to target themselves', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test User 0', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if attempting to target an eliminated player', () => {
    game.phase = Phase.Night;
    (game.getPlayer('2') as Player).alive = false;
    const command = Command.parse('!target Test User 2', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('do nothing if attempting to target an another werewolf player', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test User 1', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).toBeUndefined();
  });
  test('set current target if all else is valid', () => {
    game.phase = Phase.Night;
    const command = Command.parse('!target Test User 2', game) as Command;

    werewolf.action(command);
    expect(werewolf.currentTarget).not.toBeUndefined();
  });
});
