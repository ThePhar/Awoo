import * as Discord from 'discord.js';
import Player from '../../src/structs/player';
import createMember from '../fixtures/createMember';

let member: Discord.GuildMember;
let player: Player;
beforeEach(() => {
  member = createMember('1234567890', 'TestUser');
  player = new Player(member);
});

describe('toString()', () => {
  test('prints valid discord format', () => {
    expect(player.toString()).toBe('<@1234567890>');
  });
});

describe('message(content)', () => {
  test('calls send function on inner member object', () => {
    const testMessage = 'Hello, world!';

    player.message(testMessage);
    expect(member.send).toHaveBeenLastCalledWith(testMessage);
  });
});

describe('get tag()', () => {
  test('return the user tag on the inner member object', () => {
    expect(player.tag).toBe(member.user.tag);
  });
});
