import * as Discord from 'discord.js';
import Game from '../../src/structs/game';
import createTextChannel from '../fixtures/createTextChannel';

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
