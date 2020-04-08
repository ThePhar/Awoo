import * as Discord from 'discord.js';
import Player from '../../src/structs/player';
import Roles from '../../src/roles';
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

describe('assignRole', () => {
  test('should assign role', () => {
    player.assignRole(Roles.Werewolf);
    expect(player.role.name).toBe('werewolf');
  });
});

describe('get tag()', () => {
  test('return the user tag on the inner member object', () => {
    expect(player.tag).toBe(member.user.tag);
  });
});

describe('get id()', () => {
  test('return the id on the inner member object', () => {
    expect(player.id).toBe(member.id);
  });
});
