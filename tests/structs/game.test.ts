import * as Discord from 'discord.js';
import Game from '../../src/structs/game';
import Player from '../../src/structs/player';
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
