import Command from '../../src/structs/command';
import Game from '../../src/structs/game';
import createTextChannel from '../fixtures/createTextChannel';
import createMember from '../fixtures/createMember';

let game: Game;
beforeEach(() => {
  game = new Game(createTextChannel());
  for (let n = 0; n < 3; n += 1) {
    game.addPlayer(createMember(n.toString(), `Test User ${n}`, `000${n}`));
  }
});


describe('parse(string, game)', () => {
  test('returns undefined if game does not begin with prefix', () => {
    const string = 'Hey what up?';
    const command = Command.parse(string, game);

    expect(command).toBeUndefined();
  });
  test('return a command object without a target specified', () => {
    const string = '!kill';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(0);
    expect(command.error).toBe('No arguments');
  });
  test('return a command object with a discord mention target, and found player', () => {
    const string = '!kill <@1>';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(1);
    expect(command.error).toBeNull();
  });
  test('return a command object with a discord mention target, and found no players', () => {
    const string = '!kill <@5>';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(0);
    expect(command.error).toBeNull();
  });
  test('return a command object with a discord nickname mention, and found', () => {
    const string = '!kill <@!1>';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(1);
    expect(command.error).toBeNull();
  });
  test('return a command object with a standard string, and found 1 player', () => {
    const string = '!kill Test user 2';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(1);
    expect(command.error).toBeNull();
  });
  test('return a command object with a standard string, and found multiple players', () => {
    const string = '!kill Test';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(3);
    expect(command.error).toBeNull();
  });
  test('return a command object with a standard string, and found no players', () => {
    const string = '!kill NonExist';
    const command = Command.parse(string, game) as Command;

    expect(command.type).toBe('kill');
    expect(command.targets.length).toBe(0);
    expect(command.error).toBeNull();
  });
});
